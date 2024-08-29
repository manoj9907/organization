const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Organization = require("./models/Organization");
const faker = require("faker");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    const org = new Organization({
      name: "My Organization",
      address: "123 Main St",
    });

    await org.save();

    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123", // Should be hashed automatically
      role: "admin",
      organization: org._id,
    });

    await admin.save();

    console.log("Data seeded");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    mongoose.disconnect();
  });

async function seedOrganizations() {
  for (let i = 0; i < 10; i++) {
    const organization = new Organization({
      name: faker.company.companyName(),
      address: faker.address.streetAddress(),
    });
    await organization.save();
  }
  console.log("Organizations seeded");
}

seedOrganizations();
