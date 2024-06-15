const express = require("express");
const path = require("path");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3012;

app.use(express.static(path.join(__dirname, "../frontend/public")));

let nextCursor = null;

async function fetchModels(page, lora, locon) {
  let data = null;

  try {
    const response = await axios.get("https://civitai.com/api/v1/models", {
      params: {
        nsfw: true,
        sort: "Newest",
        types: lora ? "LORA" : "LoCon",
        limit: 100,
        page: page,
        // pass the next cursor if it's available
        cursor: nextCursor,
      },
    });

    data = response.data;
    nextCursor = data.metadata.nextCursor;
    return data;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}

const lora = process.argv.includes("--lora");
const locon = process.argv.includes("--locon");

app.get("/api/models", async (req, res) => {
  try {
    // Start on page 1
    const models = await fetchModels(1, lora, locon);
    res.json(models);
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).send("Error fetching models");
  }
});

app.get("/api/models/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const models = await fetchModels(page, lora, locon);
    res.json(models);
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).send("Error fetching models");
  }
});

// Download endpoint for the model, image, and the model tags in a generated text file
app.get("/download/:modelId", async (req, res) => {
  const { modelId } = req.params;
  const models = await fetchModels(1, lora, locon);
  const model = models.find((model) => model.id === Number(modelId));

  if (!model) {
    res.status(404).send("Model not found");
    return;
  }

  const modelName = model.name;
  const modelTags = model.tags.join(",");
  const text = `${modelName}${modelTags ? "," + modelTags : ""}`;

  const filePath = path.join(__dirname, `downloads/${modelName}.txt`);
  fs.writeFile(filePath, text, (err) => {
    if (err) {
      console.error("Error writing to text file:", err);
      res.status(500).send("Error writing to text file");
      return;
    }

    res.download(model.modelVersions.downloadUrl, `${modelName}.zip`);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
