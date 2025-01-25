import random
from PIL import Image
import math

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
        new_h = int(max_img_width / aspect_ratio)
    else:
        new_h = max_img_height
        new_w = int(max_img_height * aspect_ratio)
    return img.resize((new_w, new_h), Image.BICUBIC)

def place_image(new_image, img, width, height, existing_rects, max_attempts, max_resizes):
    img_w, img_h = img.size
    for _ in range(max_resizes):
        for _ in range(max_attempts):
            x = random.randint(5, (width-5) - img_w)
            y = random.randint(5, (height-5) - img_h)
            if not overlaps(x, y, img_w, img_h, existing_rects):
                new_image.paste(img, (x, y))
                existing_rects.append((x, y, img_w, img_h))
                return True
        scale_factor = random.uniform(0.5, 0.9)
        new_w = int(img_w * scale_factor)
        new_h = int(img_h * scale_factor)
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
    
    new_image = Image.new("RGB", (width, height), (255, 255, 255))
    
    existing_rects = []
    max_attempts = 1000
    max_resizes = 15
    for img in resized_images:
        if not place_image(new_image, img, width, height, existing_rects, max_attempts, max_resizes):
            print(f"Could not place image {img} after {max_resizes} resizes and {max_attempts} attempts each.")
    
    new_image.save(output_path)

def overlaps(x, y, w, h, existing_rects):
    for rect in existing_rects:
        if not (x + w <= rect[0] or x >= rect[0] + rect[2] or y + h <= rect[1] or y >= rect[1] + rect[3]):
            return True
    return False

if __name__ == "__main__":
    image_paths = ['imgs/go.png', 'imgs/uipath.png', 'imgs/java.png']
    new_paths = [white_background(img, "new_" + img) for img in image_paths]
    print(new_paths)
    output_path = 'combined.png'
    combine_images(new_paths, output_path, 1100, 800)
    # white_background(output_path, "test.jpeg")