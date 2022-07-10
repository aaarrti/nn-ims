import os
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from typing import Union, List, Callable

HUB_HANDLE = 'https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2'
NN: Callable = hub.load(HUB_HANDLE)

IMAGE_SIZE = (256, 256)
OUTPUT_IMAGE_SIZE = 384


def crop_center(image: np.ndarray):
    """
    Returns a cropped square image.
    """
    shape = image.shape
    new_shape = min(shape[1], shape[2])
    offset_y = max(shape[1] - shape[2], 0) // 2
    offset_x = max(shape[2] - shape[1], 0) // 2
    image = tf.image.crop_to_bounding_box(
        image, offset_y, offset_x, new_shape, new_shape)
    return image


def bytes_to_tensor(path: str) -> Union[np.ndarray, tf.Tensor]:
    img = tf.io.decode_image(
        tf.io.read_file(path),
        channels=3,
        dtype=tf.float32
    )[tf.newaxis, ...]
    img = crop_center(img)
    img = tf.image.resize(img, IMAGE_SIZE, preserve_aspect_ratio=True)
    return img


def do_style_image(image: bytearray, style: bytearray) -> List[int]:
    with open('temp1.png', 'wb+') as f1:
        f1.write(image)
    with open('temp2.png', 'wb+') as f2:
        f2.write(style)

    content_image = bytes_to_tensor('temp1.png')
    style_image = bytes_to_tensor('temp2.png')

    style_image = tf.nn.avg_pool(
        style_image,
        ksize=[2, 2],
        strides=[1, 1],
        padding='VALID'
    )
    outputs = NN(tf.constant(content_image), tf.constant(style_image))
    stylized_arr: np.ndarray = outputs[0].numpy()[0]

    stylizes_img = np.uint8(stylized_arr * 255)

    png_arr = tf.io.encode_png(stylizes_img)
    tf.io.write_file('temp3.png', png_arr)

    with open("temp3.png", "rb") as f:
        byte_arr = f.read()

    os.remove('temp1.png')
    os.remove('temp2.png')
    os.remove('temp3.png')

    return [int(i) for i in byte_arr]
