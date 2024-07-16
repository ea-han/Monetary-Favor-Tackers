from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Favor, Tag
from django.http import JsonResponse
from .forms import FavorForm, TagForm

# Create your views here.
# view a list of all favors, ordered by date of creation
def favor_list(request): 
    all_favors = Favor.objects.order_by("-created_at")
    favors_list = list(all_favors.values())
    # return render(request, 'favors/favor_list.html', {"favors": all_favors})
    return JsonResponse({"favors": favors_list})

# view a specific favor based on id
def favor_detail(request, favor_id):
    favor = get_object_or_404(Favor, pk=favor_id)
    tags = list(favor.tags.all().values())
    favor_data = {"name": favor.name, 
                  "id": favor.id, 
                  "description": favor.description, 
                  "owner": {"id": favor.owner.id, "email": favor.owner.email, "username": favor.owner.username}, 
                  "assignee": {"id": favor.assignee.id, "email": favor.assignee.email, "username": favor.assignee.username}
                  if favor.assignee else None, 
                  "created_at": favor.created_at,
                  "updated_at": favor.updated_at,
                  "total_owed_type": favor.total_owed_type,
                  "totwal_owed_amt": favor.total_owed_amt,
                  "privacy": favor.privacy,
                  "status": favor.status,
                  "tags": tags,}
    # return render(request, 'favors/favor_detail.html', {"favor": favor, "tags": tags})
    return JsonResponse(favor_data)

# view a list of all tags, with preset tags listed before custom tags
def tag_list(request):
    all_tags = Tag.objects.order_by("-tag_type")
    tags_list = list(all_tags.values())
    # return render(request, 'favors/tag_list.html', {"tags": all_tags})
    return JsonResponse({"tags": tags_list})

def tag_detail(request, tag_id):
    tag = get_object_or_404(Tag, pk=tag_id)
    favors = list(Favor.objects.filter(tags=tag).values())
    tag_data = {"name": tag.name,
                "id": tag.id,
                "color": tag.color,
                "favors": favors}
    # return render(request, 'favors/tag_detail.html', {"tag": tag, "favors": favors})
    return JsonResponse(tag_data)

# create a new favor
# @login_required
def create_favor(request):
    if request.method =="POST":
        form = FavorForm(request.POST)
        if form.is_valid():
            favor = form.save(commit=False)
            favor.owner = request.user
            # favor.status = "Pending creation"
            favor.save()
            # return redirect('favor_list')
            return JsonResponse({"success": True, "favor_id": favor.id})
        else:
            # form = FavorForm()
            return JsonResponse({"success": False, "errors": form.errors})
    else: 
        #return render(request, 'favors/create_favor.html', {'form': form})
        return JsonResponse({"error": "GET method not allowed"}, status=405)

# edit a favor 
# @login_required
def edit_favor(request, favor_id):
    favor = get_object_or_404(Favor, pk=favor_id)
    if request.method == "POST":
        form = FavorForm(request.POST, instance=favor)
        if form.is_valid():
            # form.status = "Pending edits"
            form.save()
            # return redirect('favor_list')
            return JsonResponse({"sucess": True})
        else:
            #form = FavorForm(instance=favor)
            return JsonResponse({"sucess": False, "errors": form.errors})
    else:
        # return render(request, 'favors/edit_favor.html', {"form": form})
        return JsonResponse({"error": "GET method not allowed"}, status=405)

# create a new tag
# @login_required
def create_tag(request):
    if request.method == "POST":
        form = TagForm(request.POST)
        if form.is_valid():
            tag = form.save(commit=False)
            tag.owner = request.user
            # tag.owner = request.user
            tag.tag_type = "Custom"
            tag.save()
            # return redirect('tag_list')
            return JsonResponse({"success": True, "tag_ig": tag.id})
        else:
            # form = TagForm()
            return JsonResponse({"success": False, "errors": form.errors})
    else:
        # return render(request, 'favors/create_tag.html', {'form': form})
        return JsonResponse({"error": "GET method not allowed"}, status=405)

# edit a tag 
# @login_required
def edit_tag(request, tag_id):
    tag = get_object_or_404(Tag, pk=tag_id)
    if request.method == "POST":
        form = TagForm(request.POST, instance=tag)
        if form.is_valid():
            form.save()
            # return redirect('tag_list')
            return JsonResponse({"success": True})
        else:
            # form = TagForm(instance=tag)
            return JsonResponse({"success": False, "errors": form.errors})
    else:
        # return render(request, 'favors/edit_tag.html', {"form": form})
        return JsonResponse({"error": "GET method not allowed"}, status=405)

