from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db import IntegrityError
from django.template import loader

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .models import UserProfileInfo, LinkedAccounts, FriendRequest
from django.shortcuts import redirect

from django.core.mail import send_mail
from rest_framework.authtoken.models import Token

from django.http import HttpResponseNotFound, HttpResponse, Http404


from PIL import Image
from django.core.files import File

from django.contrib import messages

EMAIL_HOST_USER = "sdsc.team.pentagon@gmail.com"
BASE_URL = "http://127.0.0.1:8000/"

from django.core.exceptions import PermissionDenied
import base64


def bio(request, request_username):
    request_owner = get_object_or_404(User, username=request_username)
    user_profile = get_object_or_404(UserProfileInfo, owner=request_owner)
    data = {
        "bio":user_profile.bio_text
    }
    return JsonResponse(data=data)

def profile_pic(request, request_username):
    request_owner = get_object_or_404(User, username=request_username)
    user_profile = get_object_or_404(UserProfileInfo, owner=request_owner)

    data = {
        "pfp":base64.b64encode(user_profile.profile_image)
    }

    return JsonResponse(data=data)

def linked_accs(request, request_username):
    request_owner = get_object_or_404(User, username=request_username)
    linked_accs_list = LinkedAccounts.objects.filter(owner=request_owner)
    linked_accs_list_strs = []
    for entry in linked_accs_list:
        linked_accs_list_strs.append(entry.account_text + ":" + str(entry.id))
    linked_accs = ",".join(linked_accs_list_strs)

    data = {
        "accounts":linked_accs
    }

    return JsonResponse(data=data)

#temp sign in pages
def sign_in(request):
    #temporary sign in template
    return render(request, "users/signin.html")

def signin_attempt(request):
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(username=username,password=password)
    if user is not None:
        login(request,user=user)
        print("logged in")
        return redirect('/users/sign-up/')
    
    return redirect('/users/sign-up/')

def sign_up(request):
    return render(request, "users/register.html")
    
def log_out(request):
    logout(request)
    return 

#retrieves the list of friend requests    
# @login_required
def get_incoming_friend_requests(request):
    friend_requests = FriendRequest.objects.filter(to_user=request.user)
    data = {}
    for fr in friend_requests:
        data[fr.pk] = {"to_user":fr.to_user.username, "from_user":fr.from_user.username}
    return JsonResponse(data)
    

#retrieves the list of friends
# @login_required
def get_friends_list(request):
    friends = get_object_or_404(UserProfileInfo, owner=request.user).friends
    data = {}
    for friend in friends.all():
        data[friend.username] = "friend :)"
    return JsonResponse(data)


# @login_required
def send_friend_request(request, username):
    from_user = request.user
    to_user = User.objects.get(username=username)
    friend_req, created = FriendRequest.objects.get_or_create(from_user=from_user,to_user=to_user)
    if created:
        return JsonResponse({"success":True})
    else:
        return JsonResponse({"success":False})

# @login_required
def accept_friend_request(request, pk):
    fr = FriendRequest.objects.get(pk=pk)
    if request.user == fr.to_user:
        UserProfileInfo.objects.get(owner=fr.to_user).friends.add(fr.from_user)
        UserProfileInfo.objects.get(owner=fr.from_user).friends.add(fr.to_user)
        fr.delete()
        return JsonResponse({"success":True})
    else:
        return JsonResponse({"success":False})
    
# @login_required
def reject_friend_request(request, pk):
    fr = FriendRequest.objects.get(pk=pk)
    if request.user == fr.to_user:
        fr.delete()
        return JsonResponse({"success":True})
    else:
        return JsonResponse({"success":False})

# @login_required
def delete_account(request, request_username):
    headers = {"success": False}
    if request.user.is_authenticated:
        if request.user.username == request_username:
            request.user.is_active = False
            request.user.save()
            headers["success"] = True
            return JsonResponse(headers)
        else:
            raise JsonResponse(headers)
    else:
        return JsonResponse(headers)

def edit_bio(request, request_username):
    headers = {"success": False}
    new_bio = request.POST["new_bio"]
    if request.user.is_authenticated:
        if request.user.username == request_username:
            profile = get_object_or_404(UserProfileInfo, owner=request.user)
            profile.bio_text = new_bio
            profile.save()
            return JsonResponse(headers)
        else:
            raise JsonResponse(headers)
    else:
        return JsonResponse(headers)

def edit_profile_pic(request, request_username):
    headers = {"success": False}
    new_pic = request.POST["new_pic"]
    if request.user.is_authenticated:
        if request.user.username == request_username:
            profile = get_object_or_404(UserProfileInfo, owner=request.user)
            profile.profile_image = new_pic
            profile.save()
            return JsonResponse(headers)
        else:
            raise JsonResponse(headers)
    else:
        return JsonResponse(headers)

def add_link(request, request_username):
    headers = {"success": False}
    link = request.POST["link"]
    if request.user.is_authenticated:
        if request.user.username == request_username:
            new_link = LinkedAccounts(owner=request.user, account_text=link)
            new_link.save()
            return JsonResponse(headers)
        else:
            raise JsonResponse(headers)
    else:
        return JsonResponse(headers)

def remove_link(request, request_username):
    headers = {"success": False}
    id = request.POST["id"]
    if request.user.is_authenticated:
        if request.user.username == request_username:
            LinkedAccounts.objects.filter(id=id).delete()
            return JsonResponse(headers)
        else:
            raise JsonResponse(headers)
    else:
        return JsonResponse(headers)
    
def register_user(request):

    username =request.POST["username"]
    password =request.POST["password"]
    email = request.POST["email"]

    new_user = User(username=username,password=password,email=email,is_active=False)
    try:
        new_user.save()
    except IntegrityError:
        return HttpResponseNotFound("user already exists")         
    
    new_token = Token.objects.create(user=new_user)
    new_token.save()

    new_bio = UserProfileInfo(bio_text="No information given.", owner=new_user)
    with open("res/default.png", 'rb') as f:
        new_bio.profile_image.save('default_pfp.png', File(f), save=True)
    new_bio.save()

    send_mail(
    subject="Verify Your Email",
    message=BASE_URL + "users/verify/" + str(new_token.key),
    from_email=EMAIL_HOST_USER,
    recipient_list=[email],
    fail_silently=False
    )

    return redirect('/users/sign-up/')

def verify(request, token):
    request_user = get_object_or_404(Token,key=token).user
    request_user.is_active = True
    request_user.save()
    return redirect('/users/sign-up/')

def reset_password(request):
    email = request.POST["email"]
    try:
        attempt_user = get_object_or_404(User, email=email)
    except Http404:
        messages.add_message(request, messages.ERROR, "User does not exist.")
        return redirect('temp')

    user_token = get_object_or_404(Token, user=attempt_user)
    
    send_mail(
    subject="Reset your Password",
    message=BASE_URL + "users/reset-password/" + str(user_token.key),
    from_email=EMAIL_HOST_USER,
    recipient_list=[email],
    fail_silently=False
    )
    messages.add_message(request, messages.SUCCESS, "Email sent!")
    return redirect('temp')



def show_create_new_password(request, token):
    context = {"token":token}
    return render(request, "users/reset-password.html", context)

def create_new_password(request):
    pass1 = request.POST["pass1"]
    pass2 = request.POST["pass2"]
    token = request.POST["token"]

    if pass1 != pass2:
        print("passwords dont match")
        messages.add_message(request, messages.ERROR, "Passwords do not match.")
        return redirect('temp')
    
    user = get_object_or_404(Token,key=token).user
    user.password = pass1
    user.save()

    messages.add_message(request, messages.SUCCESS, "Password changed.")
    print("changed password")
    return redirect('temp')


def temp(request):
    context = {}
    #temporary page for testing
    return render(request, "users/forgot.html", context)





# Create your views here.
