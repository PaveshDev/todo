const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/smartclinic";

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

async function upsertUser({ full_name, email, password, phone, role, profile_image = "", status = "active" }) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);

  const user = await User.findOneAndUpdate(
    { email },
    {
      full_name,
      email,
      password_hash: `${salt}$${passwordHash}`,
      phone,
      role,
      profile_image,
      status,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return user;
}

async function run() {
  await mongoose.connect(uri);

  const patientUser = await upsertUser({
    full_name: "Pavesh",
    email: "patient@dentai.com",
    password: "Patient@123",
    phone: "0770000000",
    role: "patient",
    profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  });

  const adminUser = await upsertUser({
    full_name: "Admin Demo",
    email: "admin@dentai.com",
    password: "Admin@123",
    phone: "0770000001",
    role: "admin",
    profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  });

  await Patient.findOneAndUpdate(
    { user_id: patientUser._id },
    {
      user_id: patientUser._id,
      date_of_birth: new Date("1998-01-01"),
      gender: "Male",
      blood_group: "O+",
      address: "Colombo",
      allergies: "None",
      medical_notes: "",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Doctor.findOneAndUpdate(
    { user_id: adminUser._id },
    {
      user_id: adminUser._id,
      specialization: "General Dentistry",
      license_number: "DOC-0001",
      qualification: "BDS",
      experience: "8 years",
      clinic_name: "Dent AI Clinic",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const users = await User.find({}, { full_name: 1, email: 1, role: 1, status: 1 }).lean();
  const patients = await Patient.find({}, { user_id: 1, date_of_birth: 1, gender: 1, blood_group: 1 }).lean();
  const doctors = await Doctor.find({}, { user_id: 1, specialization: 1, clinic_name: 1 }).lean();

  console.log(JSON.stringify({ users, patients, doctors }, null, 2));
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
