import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";


function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();  
  const [selectedImage, setSelectedImage] = useState(null);

  // HTML input element reference to trigger the file input when clicking on the avatar
  const fileInputRef = useRef(null);

  const mouseClickSound = new Audio("/public/mouse-click.mp3");

  // Function to compress image before upload
  const compressImage = (base64Image, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with reduced quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return; // if no file is selected, do nothing
    
    const reader = new FileReader();
    // read the file as a data URL (base64 string), 
    // which can be easily uploaded to the server or cloudinary
    reader.readAsDataURL(file); 
    // when the file loaded ended, set it as the selected image and update the user's profile picture
    reader.onloadend = async () => {  
      const base64Image = reader.result;      
      // Compress the image before uploading
      const compressedImage = await compressImage(base64Image);
      setSelectedImage(compressedImage);
      // lets upload it the cloudinary
       await updateProfile({ profilePic: compressedImage });
    };   
  };
 
  return (
    // user image, there is a default image , and the user can upload his own image    
    // user name
    // is the user online or not
    // logout button
    // mute button
     <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImage || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
        </div>
        {/* USER NAME & STATUS */}
        <div>
          <h3 className="text-base font-medium text-slate-200 max-w-[180px] truncate">{authUser.fullName}</h3>
          <p className="text-slate-400 text-xs">Online</p>
        </div>
        {/* BUTTONS */}
        <div className="flex items-center gap-4">
          <button
            onClick={logout}
            className="p-2 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
          >
            <LogOutIcon className="size-5 " />
          </button>
           <button
            onClick={() => {
              mouseClickSound.currentTime = 0; // reset the sound to the beginning
              mouseClickSound.play()
                .catch((error) => console.log("Audio play failed:", error)); // play the sound
              toggleSound();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader