# Model Viewer Downloader

Welcome to **Model Viewer Downloader**! Unlike its similarly named sibling, Model View Controller (MVC), this web app isn't about controlling your models – it's about viewing and downloading them! 

## Introduction

Model Viewer Downloader is a web application that leverages the Civitai REST API to fetch the latest LoRA and LyCORIS/LoCON models for use in Stable Diffusion, specifically for checkpoint model versions 1.4 and 1.5. It offers a user-friendly interface to view and download these models with ease.

## Features

- **Model Display**: Shows the first image from each model's page.
- **Tag Filtering**: Filters user-created tags through a custom subset of tags, covering most generic focuses of image generation, and displays them below the image.
- **Download Links**: Creates a download link for each model, displaying the download size.
- **Comprehensive Downloads**: Downloading a model includes the model file, the first image (named the same as the model), and a `.txt` file containing all trigger words for the model. If a theme is selected, the theme name is prepended to the `.txt` file (e.g., `style_MODEL_NAME.txt`).
- **Dark Mode**: Features a dark mode toggle for a more comfortable viewing experience in low-light environments.
- **Mobile Support**: Designed to be responsive and includes styling for both desktop and mobile devices.

## Why Use This Web App?

This web app was designed to bypass the limitations of the default search filtering system, which often mixes results for newer and older checkpoint versions, causing compatibility issues in Stable Diffusion. Although built for a specific use case, it can be easily adapted to different LoRA version groups.

## Installation

To get started, follow these steps to install both the frontend and backend components.

### Backend Installation

1. Navigate to the `backend` directory.
2. Install the required Node.js modules:
    ```bash
    cd backend
    npm install
    ```

### Frontend Installation

1. Navigate to the `frontend` directory.
2. Install the required Node.js modules:
    ```bash
    cd frontend
    npm install
    ```

## Running the Application

You can run the application in either LoRA or LoCON mode using the command line.

### LoRA Mode

Create a batch file or run the following command:
(example use in the default downloads directory)

```batch
@echo off
cd /d "C:\Users\your_username\Downloads\model_viewer_downloader\backend"
node index --lora
```

### LoCON Mode

Create a batch file or run the following command:
(example use in the default downloads directory)

```batch
@echo off
cd /d "C:\Users\your_username\Downloads\model_viewer_downloader\backend"
node index --locon
```
