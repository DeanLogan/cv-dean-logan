import numpy as np
import cv2
import random

def white_background(image_path, output_path):
    image = cv2.imread(image_path)
    lower_white = np.array([220, 220, 220], dtype=np.uint8)
    upper_white = np.array([255, 255, 255], dtype=np.uint8)
    mask = cv2.inRange(image, lower_white, upper_white)
    
    # Improve background changing
    coloured = image.copy()
    coloured[mask == 255] = (255, 255, 255)
    
    res = cv2.bitwise_not(coloured, coloured, mask)
    cv2.imwrite(output_path, res)

if __name__ == "__main__":
    image_paths = ['imgs/go.png', 'imgs/java.png', 'imgs/uipath.png']
    output_path = 'image.png'
    white_background(image_paths[0], "test.png")