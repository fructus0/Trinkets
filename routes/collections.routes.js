const express = require("express");
const Collection = require("../models/Collection");
const User = require("../models/User");
const Item = require("../models/Item");
const Subjects = require("../models/Subjects");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { cloudinary } = require("../utils/cloudinary");
const success = { msg: "Успешно" };
const fail = { msg: "Ошибка сервера" };
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const collections = await Collection.find({ ownerId: userId });
    const user = await User.findById(userId);
    res
      .status(201)
      .json({
        collections: [...collections],
        ownerName: user.name,
        ownerId: user._id,
      });
  } catch (e) {
    res.status(500).json(fail);
  }
});
router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Subjects.find();
    const subjectsNames = subjects.map((subject) => subject.name);
    res.status(201).json([...subjectsNames]);
  } catch (e) {
    res.status(500).json(fail);
  }
});
router.get("/collection/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).lean();
    const items = await Item.find({ collectionId: req.params.id }).lean();
    res.status(201).json({ collection: { ...collection }, items: items });
  } catch (e) {
    res.status(500).json(fail);
  }
});
router.get("/biggestCollections", async (req, res) => {
  try {
    const items = await Item.aggregate([
      { $group: { _id: "$collectionId", count: { $sum: 1 } } },
    ])
      .sort({ count: "desc" })
      .limit(3);
    const collections = await Collection.find({
      $or: [
        { _id: items[0]._id },
        { _id: items[1]._id },
        { _id: items[2]._id },
      ],
    });
    res.status(201).json([...collections]);
  } catch (e) {
    console.log(e.message);
    res.status(500).json(fail);
  }
});
router.post(
  "/addNewCollection",
  [
    check("title", "Введите название коллекции").notEmpty(),
    check("description", "Введите описание").notEmpty(),
    check("subject", "Выберите тему").notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          msg: errors
            .array()
            .map((el) => el.msg)
            .join(". "),
        });
      }
      req.body.optionalFields.forEach((item) => {
        if (item.name === "")
          return res.status(400).json({
            msg: "У всех дополнительных полей должно быть имя",
          });
      });
      const twin = await Collection.findOne({ title: req.body.title });
      if (twin) {
        return res
          .status(400)
          .json({ msg: "Коллекция с таким названием есть" });
      }
      const collection = new Collection({
        ...req.body,
      });
      if (req.body.image) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.image,
          { upload_preset: "ml_default" }
        );
        collection.set({ imageId: uploadedResponse.public_id });
      }
      collection.save();
      res.status(201).json(success);
    } catch (e) {
      res.status(500).json(fail);
    }
  }
);

router.post("/removeCollection", async (req, res) => {
  try {
    const deleted = await Collection.findByIdAndDelete(req.body.id);
    if (!isDefault(req.body.image)) {
      cloudinary.uploader.destroy(deleted.imageId);
    }
    if (req.body.ownerId) {
      const collections = await Collection.find({ ownerId: req.body.ownerId });
      res.status(201).json([...collections]);
    } else res.status(201).json(success);
  } catch (e) {
    res.status(500).json(fail);
  }
});
router.post("/updateCollection", async (req, res) => {
  const { id, title, description, image, subject, ownerId } = req.body;
  try {
    const updateCollection = await Collection.findByIdAndUpdate(id, {
      title,
      description,
      subject,
    });
    if (image) {
      if (!isDefault(updateCollection.imageId)) {
        cloudinary.uploader.destroy(updateCollection.imageId);
      }
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "ml_default",
      });
      updateCollection.set({ imageId: uploadedResponse.public_id });
      await updateCollection.save();
    }
    const collections = await Collection.find({ ownerId: ownerId });
    res.status(201).json([...collections]);
  } catch (e) {
    res.status(500).json(fail);
  }
});
const isDefault = (imageId) => {
  return imageId === "h34mxfqiv9uwbdvmkmdg";
};
module.exports = router;