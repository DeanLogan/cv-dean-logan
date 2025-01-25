import os
import math
import random
from PIL import Image

def white_background(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    
    white_background = Image.new("RGBA", img.size, (255, 255, 255, 255))
    img = Image.alpha_composite(white_background, img).convert("RGB")
    
    img.save(output_path, quality=95)
    return output_path

def resize_image(img, max_img_width, max_img_height):
    img_w, img_h = img.size
    aspect_ratio = img_w / img_h
    if aspect_ratio > 1:
        new_w = max_img_width
        new_h = int(new_w / aspect_ratio)
    else:
        new_h = max_img_height
        new_w = int(new_h * aspect_ratio)
    return img.resize((new_w, new_h), Image.BICUBIC)

def place_image(new_image, img, width, height, existing_rects, max_attempts, max_resizes):
    img_w, img_h = img.size
    for resize_attempt in range(max_resizes):
        for attempt in range(max_attempts):
            # Generate random coordinates
            x = random.randint(15, width - img_w - 15)
            y = random.randint(15, height - img_h - 15)
            if not overlaps(x, y, img_w, img_h, existing_rects):
                new_image.paste(img, (x, y))
                spacing = random.randint(1, 10)
                existing_rects.append((x - spacing, y - spacing, img_w + 2 * spacing, img_h + 2 * spacing))
                return True
        
        new_w = img_w - 1
        new_h = img_h - 1
        img = img.resize((new_w, new_h), Image.BICUBIC)
        img_w, img_h = img.size
    return False

def overlaps(x, y, w, h, existing_rects):
    for rect in existing_rects:
        if not (x + w <= rect[0] or x >= rect[0] + rect[2] or y + h <= rect[1] or y >= rect[1] + rect[3]):
            return True
    return False

def combine_images(image_paths, output_path, width, height):
    images = [Image.open(img_path) for img_path in image_paths]
    num_images = len(images)
    
    max_img_width = width // math.ceil(math.sqrt(num_images))
    max_img_height = height // math.ceil(num_images / math.ceil(math.sqrt(num_images)))
    
    resized_images = [resize_image(img, max_img_width, max_img_height) for img in images]
    resized_images.sort(key=lambda img: img.size[0] * img.size[1], reverse=True)
    new_image = Image.new("RGB", (width, height), (255, 255, 255))
    
    existing_rects = []
    max_attempts = 10000
    max_resizes = 20
    for img in resized_images:
        if not place_image(new_image, img, width, height, existing_rects, max_attempts, max_resizes):
            print(f"Could not place image {img} after {max_resizes} resizes and {max_attempts} attempts each.")
    
    new_image.save(output_path)

def get_relative_file_paths(folder_path):
    relative_paths = []
    for root, _, files in os.walk(folder_path):
        for file in files:
            relative_path = os.path.relpath(os.path.join(root, file), folder_path)
            relative_paths.append(folder_path+"/"+relative_path)
    return relative_paths

if __name__ == "__main__":
    image_paths = get_relative_file_paths("imgs")
    new_paths = [white_background(img, "new_" + img) for img in image_paths]
    print(new_paths)
    combine_images(new_paths, "desktop.png", 1104, 743)
    combine_images(new_paths, "mobile.png", 545, 770)