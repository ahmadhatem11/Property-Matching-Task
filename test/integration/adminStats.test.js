import { expect } from "chai";
import request from "supertest";
import { app } from "../../app.js";
import { User } from "../../src/models/User.js";
import { Ad } from "../../src/models/Ad.js";
import { PropertyRequest } from "../../src/models/PropertyRequest.js";

describe("Admin Stats Endpoint", function () {
  this.timeout(20000);
  let adminToken;

  before(async function () {
    this.timeout(20000);

    // Clean DB
    await User.deleteMany({});
    await Ad.deleteMany({});
    await PropertyRequest.deleteMany({});

    const admin = new User({
      name: "Admin User",
      phone: "1234567890",
      role: "ADMIN",
      password: "password",
    });
    await admin.save();

    adminToken = await request(app)
      .post("/api/auth/login")
      .send({ phone: "1234567890", password: "password" })
      .then((res) => res.body.token);
  });

  it("should return stats for admin", async () => {
    const agent = new User({
      name: "Agent User",
      phone: "0987654321",
      role: "AGENT",
      password: "password",
    });
    await agent.save();

    const client = new User({
      name: "Client User",
      phone: "1112223333",
      role: "CLIENT",
      password: "password",
    });
    await client.save();

    const ad = new Ad({
      propertyType: "APARTMENT",
      area: 100,
      price: 50000,
      city: "CityName",
      district: "DistrictName",
      description: "An apartment for rent",
      user: agent._id,
    });
    await ad.save();

    const propRequest = new PropertyRequest({
      propertyType: "APARTMENT",
      area: 100,
      price: 50000,
      city: "CityName",
      district: "DistrictName",
      description: "A nice apartment",
      user: client._id,
    });
    await propRequest.save();

    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.be.an("array");
    expect(res.body.data.length).to.be.above(0);

    // Verify structure of the first user
    const userStats = res.body.data[0];
    expect(userStats).to.have.property("name");
    expect(userStats).to.have.property("role");
    expect(userStats).to.have.property("adsCount");
    expect(userStats).to.have.property("totalAdsAmount");
    expect(userStats).to.have.property("requestsCount");
    expect(userStats).to.have.property("totalRequestsAmount");
    console.log("Test Finished");
  });
});
