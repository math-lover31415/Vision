from PIL import Image
import numpy as np



def transform_colorspace(img, mat):
    return img @ mat.T

def simulate(rgb, color_deficit="d", gamma=2.4):
    # Colorspace transformation matrices
    cb_matrices = {
        "d": np.array([[1, 0, 0], [1.10104433,  0, -0.00901975], [0, 0, 1]], dtype=np.float16),
        "p": np.array([[0, 0.90822864, 0.008192], [0, 1, 0], [0, 0, 1]], dtype=np.float16),
        "t": np.array([[1, 0, 0], [0, 1, 0], [-0.15773032,  1.19465634, 0]], dtype=np.float16),
    }
    rgb2lms = np.array([[0.3904725 , 0.54990437, 0.00890159],
                        [0.07092586, 0.96310739, 0.00135809],
                        [0.02314268, 0.12801221, 0.93605194]], dtype=np.float16)
    # Precomputed inverse
    lms2rgb = np.array([[ 2.85831110e+00, -1.62870796e+00, -2.48186967e-02],
                        [-2.10434776e-01,  1.15841493e+00,  3.20463334e-04],
                        [-4.18895045e-02, -1.18154333e-01,  1.06888657e+00]], dtype=np.float16)
    # first go from RBG to LMS space
    lms = transform_colorspace(rgb, rgb2lms)
    # Calculate image as seen by the color blind
    sim_lms = transform_colorspace(lms, cb_matrices[color_deficit])
    # Transform back to RBG
    sim_rgb = transform_colorspace(sim_lms, lms2rgb)
    arr = np.clip(sim_rgb, 0, 1)
    return arr


def daltonize(rgb, color_deficit='d', gamma=2.4):
    sim_rgb = simulate(rgb, color_deficit)
    err2mod = np.array([[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]])
    err = transform_colorspace(rgb - sim_rgb, err2mod)
    dtpn = err + rgb
    arr = np.clip(dtpn, 0, 1)
    return arr


def convert_back(arr, gamma=2.4):
    arr = inverse_gamma_correction(arr, gamma=gamma)
    arr = np.clip(arr, 0, 255)
    arr = arr.astype('uint8')
    return arr

def gamma_correction(rgb, gamma=2.4):
    linear_rgb = np.zeros_like(rgb, dtype=np.float16)
    for i in range(3):
        idx = rgb[:, :, i] > 0.04045 * 255
        linear_rgb[idx, i] = ((rgb[idx, i] / 255 + 0.055) / 1.055)**gamma
        idx = np.logical_not(idx)
        linear_rgb[idx, i] = rgb[idx, i] / 255 / 12.92
    return linear_rgb

def inverse_gamma_correction(linear_rgb, gamma=2.4):
    rgb = np.zeros_like(linear_rgb, dtype=np.float16)
    for i in range(3):
        idx = linear_rgb[:, :, i] <= 0.0031308
        rgb[idx, i] = 255 * 12.92 * linear_rgb[idx, i]
        idx = np.logical_not(idx)
        rgb[idx, i] = 255 * (1.055 * linear_rgb[idx, i]**(1/gamma) - 0.055)
    return np.round(rgb)