document.addEventListener("DOMContentLoaded", () => {
  const modelsContainer = document.getElementById("modelsContainer");
  const nextPageButton = document.getElementById("nextPageButton");
  const currentPageElement = document.getElementById("currentPage");

  let currentPage = 1;
  // Number of models per page (unused)
  const modelsPerPage = 100;

  // Variable to track if new models are being fetched to prevent duplicate requests
  let fetchingModels = false;

  // Helper function to determine when to fetch the next page of models
  function shouldFetchNextPage() {
    const scrollThreshold = 200;
    return (
      !fetchingModels &&
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - scrollThreshold
    );
  }

  // Listen for scroll event and fetch next page if needed
  window.addEventListener("scroll", async () => {
    if (shouldFetchNextPage()) {
      fetchingModels = true;
      currentPage++;
      await fetchAndDisplayModels();
      fetchingModels = false;
    }
  });

  function formatFileSize(size, inputUnit = "KB") {
    const units = ["B", "KB", "MB", "GB", "TB"];
    const unitIndex = units.indexOf(inputUnit.toUpperCase());

    if (unitIndex === -1) {
      // Invalid unit, return as is
      return `${size} ${inputUnit}`;
    }

    let convertedSize = size;
    let index = unitIndex;
    while (convertedSize >= 1024 && index < units.length - 1) {
      convertedSize /= 1024;
      index++;
    }

    return `${convertedSize.toFixed(2)} ${units[index]}`;
  }

  function findMatchingEntries(array1, array2) {
    const matchingEntries = [];

    for (let i = 0; i < array1.length; i++) {
      const entry1 = array1[i];

      for (let j = 0; j < array2.length; j++) {
        const entry2 = array2[j];

        if (entry1 === entry2) {
          matchingEntries.push(entry1);
          break;
        }
      }
    }

    return matchingEntries;
  }

  const tagChecklist = [
    "2D",
    "3D",
    "animal",
    "animals",
    "av actress",
    "avactress",
    "background",
    "backgrounds",
    "BDSM",
    "body",
    "building",
    "buildings",
    "cartoon",
    "celebrity",
    "character",
    "characters",
    "clothes",
    "clothing",
    "coloredskin",
    "colored skin",
    "colouredskin",
    "coloured skin",
    "concept",
    "emotion",
    "environment",
    "environmental",
    "fantasy",
    "fashion",
    "fictional character",
    "fictionalcharacter",
    "game",
    "games",
    "gay",
    "gravure",
    "hentai",
    "horror",
    "influencer",
    "jav",
    "kpop",
    "location",
    "locations",
    "meme",
    "minecraft",
    "photorealistic",
    "photo realistic",
    "pixel",
    "pixels",
    "pixelart",
    "pixel art",
    "pornstar",
    "pose",
    "realistic",
    "retro",
    "RPG",
    "role playing game",
    "scifi",
    "sci fi",
    "science fiction",
    "sciencefiction",
    "style",
    "texture",
    "textures",
    "vehicle",
    "vehicles",
    "video game",
    "videogame",
    "video games",
    "videogames",
    "voxel",
    "voxels",
  ];

  function appendModels(models) {
    models.forEach((model) => {
      const modelDiv = document.createElement("div");
      modelDiv.classList.add("model");

      const modelNameContainer = document.createElement("div");
      modelNameContainer.classList.add("model-name-container");

      const modelImageContainer = document.createElement("div");
      modelImageContainer.classList.add("model-image-container");

      const modelDownloadContainer = document.createElement("div");
      modelDownloadContainer.classList.add("model-download-container");

      const modelName = document.createElement("h2");
      modelName.textContent = model.name;
      modelName.classList.add("model-name");

      const modelPageLink = document.createElement("a");
      modelPageLink.href = `https://civitai.com/models/${model.id}`;
      // Open link in new tab
      modelPageLink.target = "_blank";
      modelPageLink.rel = "noopener noreferrer";
      modelPageLink.innerHTML =
        '<img src="/static/image/to_page.png" alt="Model Link" class="model-link-img">';

      const modelImage = document.createElement("img");
      const images = model.modelVersions[0].images;
      if (images && images.length > 0) {
        // Use the first image if available
        modelImage.src = images[0].url;
      } else {
        // Use a placeholder image
        modelImage.src =
          "https://princessinthetower.org/wp-content/uploads/2015/04/bigstock-Seated-sad-young-man-33752714.jpg";
      }
      modelImage.classList.add("model-image");
      modelImage.alt = "Model Image";

      const modelDescription = document.createElement("p");
      modelDescription.innerHTML = model.description;

      const modelTrigs = document.createElement("p");
      modelTrigs.classList.add("model-trigs");
      modelTrigs.textContent = `Triggers: ${model.modelVersions[0].trainedWords.join(
        ", "
      )}`;
      var trigsOn = false;

      const modelTags = document.createElement("p");
      modelTags.classList.add("model-tags");
      const filteredTags = findMatchingEntries(tagChecklist, model.tags);
      modelTags.textContent = `${filteredTags.join(", ")}`;

      const downloadLink = document.createElement("button");
      downloadLink.classList.add("download-button");
      if (model.modelVersions[0].files[0]) {
        const fileSize = formatFileSize(model.modelVersions[0].files[0].sizeKB);
        downloadLink.textContent = `Download ${fileSize}`;
      } else {
        downloadLink.textContent = "Download";
      }

      // Create a refresh button
      const refreshButton = document.createElement("a");
      refreshButton.classList.add("refresh-button");
      refreshButton.textContent = "R";
      refreshButton.hidden = true;

      downloadLink.addEventListener("click", async (event) => {
        event.preventDefault();

        // Download the model file
        const modelFileUrl = model.modelVersions[0].downloadUrl;
        const modelHash = model.modelVersions[0].files[0].hashes.SHA256;
        const modelFullFileName = model.modelVersions[0].files[0].name;

        const radioButtons = document.getElementsByName("file-prefix");
        let selectedPrefix = "";

        // Find the selected radio button value
        radioButtons.forEach((radio) => {
          if (radio.checked) {
            selectedPrefix = radio.value;
          }
        });

        const txtFileNamePrefix = selectedPrefix ? `${selectedPrefix}_` : "";

        var modelFileName;
        const lastDotIndex = modelFullFileName.lastIndexOf(".");
        if (lastDotIndex !== -1) {
          modelFileName = modelFullFileName.substring(0, lastDotIndex);
          // Exit the function if no valid modelFileName
        } else {
          console.log("Error: No file extension found for model.");
          return;
        }

        // Create and download the .txt file
        const trigs = model.modelVersions[0].trainedWords.join(", "); // Assuming trigs are stored as an array in model.trigs
        const textContent = trigs
          ? `${modelFileName}, ${trigs}`
          : modelFileName;

        const txtBlob = new Blob([textContent], { type: "text/plain" });
        const txtBlobUrl = URL.createObjectURL(txtBlob);
        const txtLink = document.createElement("a");
        txtLink.href = txtBlobUrl;
        txtLink.download = `${txtFileNamePrefix}${modelFileName}.txt`;
        txtLink.rel = "noopener noreferrer";

        // Programmatically trigger the download click event
        const downloadClickEvent = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        txtLink.dispatchEvent(downloadClickEvent);

        // Download the model file
        const modelLink = document.createElement("a");
        modelLink.href = modelFileUrl;
        modelLink.download = `${modelFileName}`;
        modelLink.rel = "noopener noreferrer";

        // Programmatically trigger the model file download click event
        const modelDownloadClickEvent = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        modelLink.dispatchEvent(modelDownloadClickEvent);

        // Download the image (first image of model)
        const imageUrl = model.modelVersions[0].images[0].url;
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        downloadBlob(
          imageBlob,
          `${modelFileName}.${getImageFileExtension(imageUrl)}`
        );

        downloadLink.disabled = true;
        refreshButton.hidden = false;

        // Add a click event listener to the refresh button
        refreshButton.addEventListener("click", () => {
          downloadLink.disabled = false;
          refreshButton.hidden = true;
        });
      });

      modelDownloadContainer.appendChild(downloadLink);
      modelDownloadContainer.appendChild(refreshButton);

      modelNameContainer.appendChild(modelPageLink);
      modelNameContainer.appendChild(modelName);

      modelImageContainer.appendChild(modelImage);

      modelDiv.appendChild(modelImageContainer);
      if (model.tags.length != 0) {
        modelDiv.appendChild(modelTags);
      }
      modelDiv.appendChild(modelNameContainer);
      // modelDiv.appendChild(modelDescription);
      if (model.modelVersions[0].trainedWords.length > 0 && trigsOn == true) {
        modelDiv.appendChild(modelTrigs);
      }
      modelDiv.appendChild(modelDownloadContainer);

      modelsContainer.appendChild(modelDiv);
    });
  }

  nextPageButton.addEventListener("click", async () => {
    currentPage++;
    await fetchAndDisplayModels();
    updatePaginationButtons();
  });

  function updatePaginationButtons() {
    nextPageButton.disabled = false;
  }

  // Function to fetch and filter models from the external API using axios
  async function fetchAndDisplayModels() {
    try {
      const response = await fetch(`/api/models/${currentPage}`);
      const responseData = await response.json();
      const models = responseData.items;

      // Filter models based on baseModel
      const filteredModels = models.filter((model) => {
        const modelVersion = model.modelVersions[0];
        // Skip models with no version information
        if (!modelVersion) {
          return false;
        }

        const baseModel = modelVersion.baseModel;
        return baseModel.includes("SD 1.5") || baseModel.includes("SD 1.4");
      });

      appendModels(filteredModels);
      currentPageElement.textContent = currentPage;
    } catch (error) {
      console.error("Error fetching and displaying models:", error);
    }
  }

  function getImageFileExtension(url) {
    const parts = url.split(".");
    return parts[parts.length - 1];
  }

  function downloadResource(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  function downloadBlob(blob, filename) {
    const blobUrl = URL.createObjectURL(blob);
    downloadResource(blobUrl, filename);
  }

  // Initial fetch and display
  fetchAndDisplayModels();
  // updatePaginationButtons();

  // Additional logging for debugging
  console.log("Script.js loaded.");

  // Optional: Log any fetch errors
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled Promise Rejection:", event.reason);
  });
});
