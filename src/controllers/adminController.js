import { User } from "../models/User.js";
import { Ad } from "../models/Ad.js";
import { PropertyRequest } from "../models/PropertyRequest.js";

export const getAdminStats = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const aggregationPipeline = [
    {
      $lookup: {
        from: "ads",
        localField: "_id",
        foreignField: "user",
        as: "ads",
      },
    },
    {
      $lookup: {
        from: "propertyrequests",
        localField: "_id",
        foreignField: "user",
        as: "requests",
      },
    },
    {
      $project: {
        name: 1,
        role: 1,
        phone: 1,
        status: 1,
        adsCount: { $size: "$ads" },
        totalAdsAmount: { $sum: "$ads.price" },
        requestsCount: { $size: "$requests" },
        totalRequestsAmount: { $sum: "$requests.price" },
      },
    },
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $project: {
        data: 1,
        total: { $arrayElemAt: ["$totalCount.count", 0] },
        page: { $literal: page },
        limit: { $literal: limit },
        hasNextPage: {
          $cond: {
            if: {
              $gt: [{ $arrayElemAt: ["$totalCount.count", 0] }, page * limit],
            },
            then: true,
            else: false,
          },
        },
        hasPreviousPage: {
          $cond: {
            if: { $gt: [page, 1] },
            then: true,
            else: false,
          },
        },
      },
    },
  ];

  const result = await User.aggregate(aggregationPipeline);

  res.json(result[0]);
};
