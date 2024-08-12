import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	KeyboardAvoidingView,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "../../../store/payment";

import apiService from "../../../api/apiRequest.js";
import FavorCard from "../../../components/FavorCard.js";
import Button from "../../../components/UI/Button.js";
import IconButton from "../../../components/UI/IconButton.js";
import ScrollViewHelper from "../../../components/UI/ScrollViewHelper.js";
import EditAboutMe from "../../../components/UI/UserProfileHelpers/EditAboutMe.js";
import EditPaymentMethods from "../../../components/UI/UserProfileHelpers/EditPaymentMethods.js";
import ProfileImage from "../../../components/UI/UserProfileHelpers/ProfileImage.js";
import ProfileModal from "../../../components/UI/UserProfileHelpers/ProfileModal.js";

import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { GLOBAL_STYLES } from "../../../constants/styles.js";
import {
	DUMMY_FAVORS_OF_PROFILE,
	DUMMY_USER_PROFILE,
} from "../../../util/dummy-data.js";

/*
    Implementation Details
    (Currently UI outline for personal profile, no real usability just yet)

        - 'user' prop is meant to give the needed Information of the user.
        Refer to DUMMY_USER_PROFILE for the desired information.

        - 'isPersonalProfile' prop renders page depending on if this is the user's 
        personal profile or anothers profile. If this is user's profile, then edits are allowed.
        Otherwise, then this page is for VIEWING ONLY and not suppose to be edited (bool value).
            - If true, only About Me and Payment Methods can be altered on this page.
            The user settings can control changes to USERNAME, Email, USER Picture, 
            Password, and Delete Account.
            - About me edits are to have a save or cancel button, which alters user about me
            depending on edits.
            - Payment Method changes are to have edit and save button. When adding payment method,
            a pop up will be presented to handle the payment method and type. The delete will prompt a 
            pop up that will confirm if the user wants to delete payment method. 
            - The icon for payment methods should be copy links for when user views another account.
        
        Recent Bounties should only have the bounties of the past 30 days. Filter only by 'All', 'Owed',
        'Receieved'. Sort by completed to in-progress and vice versa (no deleted bounties). Sort by date created. 


*/

function UserProfileScreen() {
	// set authorization token here
	const authToken = useSelector((state) => state.authToken);
	//apiService.setAuthorizationHeader(authToken.authToken);
	const navigation = useNavigation();
	const username = useSelector((state) => state.username);
	const [isEditing, setIsEditing] = useState(false);
	const [aboutMe, setAboutMe] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const payments = useSelector((state) => state.paymentMethods.paymentMethods);
	const [isPfpModalVisible, setIsPfpModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [rating, setRating] = useState("");
	const [friendCount, setFriendCount] = useState("");
	const dispatch = useDispatch();

	useFocusEffect(
		useCallback(() => {
			const fetchProfile = async () => {
				try {
					//set the bio
					const response = await apiService.getUserBio(username.username);
					setAboutMe(response.bio);

					const responseHi = await apiService.getRating(username.username);
					setRating(responseHi.rating);

					const responseHello = await apiService.getFriendCount(
						username.username,
					);
					setFriendCount(responseHello.friendCount);

					// reload the payment method storage
					const response2 = await apiService.getUserLinks(username.username);
					console.log(response2)
					// dispatch(setPaymentMethod(response2));
					console.log()

					const response3 = await apiService.getUserPic(username.username);
					setImageUrl(response3.url);
					console.log(imageUrl);
				} catch (error) {
					console.log(error);
				} finally {
					setLoading(false);
				}
			};

			fetchProfile();
		}, [username.username, dispatch, imageUrl]),
	);

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	//if hit the save button, try to save the bio.
	async function toggleEdit() {
		console.log(`token = ${authToken.authToken}`);
		setIsEditing((curr) => !curr);
		if (isEditing) {
			console.log("sending the edited bio");
			console.log(aboutMe);
			data = { bio: aboutMe };
			try {
				const bioResponse = await apiService.updateUserBio(
					username.username,
					data,
					authToken.authToken,
				);
				if (bioResponse.status === "fail") {
					throw new Error("Edit Bio Failed");
				}
			} catch (error) {
				throw new Error("network errors");
			}
		}
	}

	function editAboutMeHandler(text) {
		setAboutMe(text);
	}

	let aboutMeSection = (
		<EditAboutMe
			aboutMe={aboutMe}
			onPress={editAboutMeHandler}
			isEditing={isEditing}
		/>
	);

	if (isEditing) {
		aboutMeSection = (
			<EditAboutMe
				aboutMe={aboutMe}
				onPress={editAboutMeHandler}
				isEditing={isEditing}
			/>
		);
	}

	let paymentMethodSection = 
	<Text>
		Hello Payments
	</Text>

	// let paymentMethodSection = (
	// 	<EditPaymentMethods isEditing={isEditing} userData={payments} />
	// );

	// if (isEditing) {
	// 	paymentMethodSection = (
	// 		<EditPaymentMethods
	// 			managePaymentsPage={() => navigation.navigate("LinkedAccounts")}
	// 			isEditing={isEditing}
	// 			userData={payments}
	// 		/>
	// 	);
	// }

	function openPfpModal() {
		setIsPfpModalVisible(true);
	}

	function closePfpModal() {
		setIsPfpModalVisible(false);
	}

	function removePfp() {
		setPfpSource(null);
		setIsPfpModalVisible(false);
	}

	// picks image
	const pickImageAsync = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setPfpSource(result.assets[0].uri);
			setIsPfpModalVisible(false);
		}
	};

	return (
		<ScrollViewHelper backgroundColor={GLOBAL_STYLES.colors.brown300}>
			<View style={styles.page}>
				<View style={[styles.userMainDetails]}>
					<View style={styles.userMainDetailsTopView}>
						<View style={styles.imageAndUsernameView}>
							{isEditing ? (
								<View>
									<ProfileImage selectedImage={pfpSource} />

									<Pressable onPress={openPfpModal}>
										<View
											style={{
												width: 64,
												height: 64,
												marginTop: -64,
												zIndex: 100,
												justifyContent: "center",
												alignItems: "center",
												borderRadius: 32,
												backgroundColor: GLOBAL_STYLES.colors.gray500,
											}}
										>
											<Feather
												name="camera"
												size={24}
												color={GLOBAL_STYLES.colors.brown300}
											/>
										</View>
									</Pressable>
								</View>
							) : imageUrl ? (
								<Image
									style={styles.profilePicture}
									source={{ uri: imageUrl }}
								/>
							) : (
								<Image //change to placeholder later
									style={styles.profilePicture}
									source={{ uri: "placeholder link" }}
								/>
							)}

							<View>
								<Text style={styles.usernameStyles}>{username.username}</Text>
								<Text style={styles.smallTextBrown}>
									#{DUMMY_USER_PROFILE.ID}
								</Text>
							</View>
						</View>
						<View style={styles.editView}>
							{!isEditing ? (
								<>
									<Pressable onPress={toggleEdit}>
										<Text
											style={[
												styles.smallTextBrown,
												{ textDecorationLine: "underline" },
											]}
										>
											Edit
										</Text>
									</Pressable>
									<IconButton
										icon="pencil"
										color={GLOBAL_STYLES.colors.brown700}
										iconSize={18}
										onPress={toggleEdit}
									/>
								</>
							) : (
								<Button
									title="Save"
									onPress={toggleEdit}
									containerStyle={{ borderRadius: 20 }}
									buttonStyles={{
										backgroundColor: GLOBAL_STYLES.colors.orange700,
										borderRadius: 20,
										paddingHorizontal: 6,
									}}
								/>
							)}
						</View>
					</View>
					<View style={styles.userMainDetailsBottomView}>
						<View style={styles.editView}>
							<Text style={[styles.smallTextOrange, { textAlign: "center" }]}>
								Rating:
							</Text>
							<Text style={styles.scoreTextStyles}>{rating}</Text>
						</View>
						<View style={styles.editView}>
							<Text style={[styles.smallTextOrange, { textAlign: "center" }]}>
								Friend Count:{" "}
							</Text>
							<Text style={styles.scoreTextStyles}>{friendCount}</Text>
						</View>
					</View>
				</View>
				{aboutMeSection}
				{paymentMethodSection}
				<View style={styles.recentBountiesStyles}>
					<Text style={styles.subtitle}>Recent Bounties: </Text>
					{DUMMY_FAVORS_OF_PROFILE.map((favor) => (
						<FavorCard
							key={favor.description}
							favor={favor}
							onPress={() => console.log("Favor Card Details")}
						/>
					))}
				</View>

				<View>
					<ProfileModal
						isVisible={isPfpModalVisible}
						onYes={pickImageAsync}
						onNo={removePfp}
						onClose={closePfpModal}
					/>
				</View>
			</View>
		</ScrollViewHelper>
	);
}

const styles = StyleSheet.create({
	page: {
		backgroundColor: GLOBAL_STYLES.colors.brown300,
		flex: 1,
		paddingHorizontal: "10%",
		paddingVertical: 12,
		gap: 18,
		alignItems: "stretch",
		justifyContent: "center",
	},
	smallTextBrown: {
		color: GLOBAL_STYLES.colors.brown700,
		fontSize: 18,
	},
	smallTextOrange: {
		color: GLOBAL_STYLES.colors.orange700,
		fontSize: 18,
	},
	userMainDetails: {
		flex: 1,
		gap: 28,
	},
	userMainDetailsTopView: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	imageAndUsernameView: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 16,
	},
	profilePicture: {
		width: 64,
		height: 64,
		borderRadius: 32,
	},
	usernameStyles: {
		fontSize: 30,
		fontWeight: "bold",
		color: GLOBAL_STYLES.colors.blue300,
		textAlign: "left",
	},
	editView: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
	},
	userMainDetailsBottomView: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
	scoreTextStyles: {
		fontWeight: "bold",
		color: GLOBAL_STYLES.colors.blue300,
		fontSize: 22,
		textAlign: "center",
	},
	subtitle: {
		color: GLOBAL_STYLES.colors.orange700,
		fontWeight: "bold",
		textAlign: "left",
		fontSize: 18,
	},
	recentBountiesStyles: {
		flex: 1,
		gap: 8,
	},
});
export default UserProfileScreen;
