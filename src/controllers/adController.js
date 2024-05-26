import { Ad } from "../models/Ad.js";
import { PropertyRequest } from "../models/PropertyRequest.js";

export const createAd = async (req, res) => {
  const { propertyType, area, price, city, district, description } = req.body;
  const ad = new Ad({
    propertyType,
    area,
    price,
    city,
    district,
    description,
    user: req.user.id,
  });
  await ad.save();
  res.status(201).json(ad);
};

export const matchRequests = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const ad = await Ad.findById(id);
  if (!ad) return res.status(404).json({ message: "Ad not found" });

  const priceMin = ad.price * 0.9;
  const priceMax = ad.price * 1.1;

  const matchCriteria = {
    district: ad.district,
    area: ad.area,
    price: { $gte: priceMin, $lte: priceMax },
  };

  const skip = (page - 1) * limit;

  const aggregationPipeline = [
    { $match: matchCriteria },
    { $sort: { refreshedAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $facet: {
        data: [
          {
            $project: {
              _id: 1,
              propertyType: 1,
              area: 1,
              price: 1,
              city: 1,
              district: 1,
              description: 1,
              refreshedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
    { $unwind: "$totalCount" },
    {
      $project: {
        data: 1,
        total: "$totalCount.count",
        page: { $literal: parseInt(page) },
        limit: { $literal: parseInt(limit) },
        hasNextPage: {
          $cond: {
            if: { $gt: ["$totalCount.count", page * limit] },
            then: true,
            else: false,
          },
        },
        hasPreviousPage: {
          $cond: { if: { $gt: [page, 1] }, then: true, else: false },
        },
      },
    },
  ];

  const result = await PropertyRequest.aggregate(aggregationPipeline);
  const response = result[0] || {
    data: [],
    total: 0,
    page: parseInt(page),
    limit: parseInt(limit),
    hasNextPage: false,
    hasPreviousPage: page > 1,
  };
  res.json(response);
};

export const searchAds = async (req, res) => {
  const {
    propertyType,
    areaMin,
    areaMax,
    priceMin,
    priceMax,
    city,
    district,
    page = 1,
    limit = 10,
  } = req.query;

  const filterCriteria = {};

  if (propertyType) filterCriteria.propertyType = propertyType;
  if (areaMin)
    filterCriteria.area = { ...filterCriteria.area, $gte: parseInt(areaMin) };
  if (areaMax)
    filterCriteria.area = { ...filterCriteria.area, $lte: parseInt(areaMax) };
  if (priceMin)
    filterCriteria.price = {
      ...filterCriteria.price,
      $gte: parseInt(priceMin),
    };
  if (priceMax)
    filterCriteria.price = {
      ...filterCriteria.price,
      $lte: parseInt(priceMax),
    };
  if (city) filterCriteria.city = city;
  if (district) filterCriteria.district = district;

  const skip = (page - 1) * limit;

  const ads = await Ad.find(filterCriteria)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
    .lean();

  const total = await Ad.countDocuments(filterCriteria);

  res.json({
    data: ads,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  });
};
