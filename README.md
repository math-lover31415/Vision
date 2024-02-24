# Vision

## Overview
Vision is a web-based tool designed to aid individuals with color vision deficiencies and detect cataracts using machine learning algorithms. The project offers live color correction for images to enhance visibility for color blind users and incorporates a cataract detection model for early diagnosis. Additionally, a browser extension is provided for seamless integration into daily browsing activities.

## Features
- **Live Image Color Correction:** Real-time color correction of images to improve visibility for users with color vision deficiencies.
- **Cataract Detection:** Utilizes a machine learning model to detect cataracts from uploaded images, facilitating early diagnosis.
- **Browser Extension:** Integration with popular web browsers for convenient access to color correction functionality during regular internet usage.
- **Color Blindness Simulation:** Simulates color blindness by removing colors in certain spectra

## Running the Web Application locally
- Create a python virtual environment and switch to the virtual environment
- Install required dependancies required by running "pip install -r requirements.txt"
- Run "uvicorn main:app --reload"
