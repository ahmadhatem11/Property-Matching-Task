import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./src/models/User.js";
import { Ad } from "./src/models/Ad.js";
import { PropertyRequest } from "./src/models/PropertyRequest.js";

dotenv.config();

const populateDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany({});
    await Ad.deleteMany({});
    await PropertyRequest.deleteMany({});
    console.log("Cleared existing data");

    // Hash passwords
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Create users
    const users = [
      {
        name: "Admin User",
        phone: "1234567890",
        role: "ADMIN",
        password: await hashPassword("password"),
      },
      {
        name: "Agent User 1",
        phone: "0987654321",
        role: "AGENT",
        password: await hashPassword("password"),
      },
      {
        name: "Agent User 2",
        phone: "2223334444",
        role: "AGENT",
        password: await hashPassword("password"),
      },
      {
        name: "Client User 1",
        phone: "1112223333",
        role: "CLIENT",
        password: await hashPassword("password"),
      },
      {
        name: "Client User 2",
        phone: "5556667777",
        role: "CLIENT",
        password: await hashPassword("password"),
      },
      {
        name: "Client User 3",
        phone: "8889990000",
        role: "CLIENT",
        password: await hashPassword("password"),
      },
      {
        name: "Client User 4",
        phone: "9990001111",
        role: "CLIENT",
        password: await hashPassword("password"),
      },
      {
        name: "Client User 5",
        phone: "0001112222",
        role: "CLIENT",
        password: await hashPassword("password"),
      },
      {
        name: "Client User 6",
        phone: "3334445555",
        role: "CLIENT",
        password: await hashPassword("password"),
      },
    ];

    const userDocs = await User.insertMany(users);
    console.log("Users created");

    // Create ads
    const ads = [
      {
        propertyType: "APARTMENT",
        area: 100,
        price: 50000,
        city: "CityName",
        district: "DistrictName",
        description: "An apartment for rent",
        user: userDocs[1]._id,
      },
      {
        propertyType: "VILLA",
        area: 300,
        price: 200000,
        city: "CityName",
        district: "LuxuryDistrict",
        description: "A luxurious villa",
        user: userDocs[1]._id,
      },
      {
        propertyType: "HOUSE",
        area: 200,
        price: 150000,
        city: "CityName",
        district: "SuburbanDistrict",
        description: "A beautiful house",
        user: userDocs[2]._id,
      },
      {
        propertyType: "LAND",
        area: 500,
        price: 100000,
        city: "CityName",
        district: "RuralDistrict",
        description: "A large plot of land",
        user: userDocs[2]._id,
      },
      {
        propertyType: "APARTMENT",
        area: 80,
        price: 40000,
        city: "CityName",
        district: "DistrictName",
        description: "A cozy apartment",
        user: userDocs[1]._id,
      },
      {
        propertyType: "HOUSE",
        area: 180,
        price: 140000,
        city: "CityName",
        district: "SuburbanDistrict",
        description: "A charming house",
        user: userDocs[2]._id,
      },
      {
        propertyType: "LAND",
        area: 600,
        price: 120000,
        city: "CityName",
        district: "RuralDistrict",
        description: "A vast plot of land",
        user: userDocs[2]._id,
      },
    ];

    await Ad.insertMany(ads);
    console.log("Ads created");

    // Create property requests
    const requests = [
      {
        propertyType: "APARTMENT",
        area: 100,
        price: 50000,
        city: "CityName",
        district: "DistrictName",
        description: "A nice apartment",
        user: userDocs[3]._id,
      },
      {
        propertyType: "HOUSE",
        area: 200,
        price: 160000,
        city: "CityName",
        district: "SuburbanDistrict",
        description: "A suburban house",
        user: userDocs[4]._id,
      },
      {
        propertyType: "VILLA",
        area: 300,
        price: 180000,
        city: "CityName",
        district: "LuxuryDistrict",
        description: "A villa with a pool",
        user: userDocs[5]._id,
      },
      {
        propertyType: "LAND",
        area: 400,
        price: 90000,
        city: "CityName",
        district: "RuralDistrict",
        description: "Land suitable for farming",
        user: userDocs[5]._id,
      },
      {
        propertyType: "APARTMENT",
        area: 90,
        price: 45000,
        city: "CityName",
        district: "DistrictName",
        description: "A small apartment",
        user: userDocs[3]._id,
      },
      {
        propertyType: "HOUSE",
        area: 220,
        price: 120000,
        city: "CityName",
        district: "SuburbanDistrict",
        description: "A spacious house",
        user: userDocs[4]._id,
      },
      {
        propertyType: "VILLA",
        area: 280,
        price: 190000,
        city: "CityName",
        district: "LuxuryDistrict",
        description: "A modern villa",
        user: userDocs[5]._id,
      },
      {
        propertyType: "LAND",
        area: 450,
        price: 95000,
        city: "CityName",
        district: "RuralDistrict",
        description: "Land with great potential",
        user: userDocs[5]._id,
      },
    ];

    await PropertyRequest.insertMany(requests);
    console.log("Property requests created");

    console.log("Database populated successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error populating database:", err);
    mongoose.connection.close();
  }
};

populateDB();
