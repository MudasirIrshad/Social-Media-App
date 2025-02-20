"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

function CreatePost() {
  const user = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {};
  return <div>CreatePost</div>;
}

export default CreatePost;
