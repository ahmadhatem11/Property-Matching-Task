import { PropertyRequest } from "../models/PropertyRequest.js";

export const createRequest = async (req, res) => {
  const { propertyType, area, price, city, district, description } = req.body;
  const request = new PropertyRequest({
    propertyType,
    area,
    price,
    city,
    district,
    description,
    user: req.user.id,
  });
  await request.save();
  res.status(201).json(request);
};

export const updateRequest = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const request = await PropertyRequest.findByIdAndUpdate(id, updates, {
    new: true,
  });
  res.json(request);
};

export const searchPropertyRequests = async (req, res) => {
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

  const requests = await PropertyRequest.find(filterCriteria)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ refreshedAt: -1 })
    .lean();

  const total = await PropertyRequest.countDocuments(filterCriteria);

  res.json({
    data: requests,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  });
};
