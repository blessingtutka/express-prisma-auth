import client, { role } from "../db-client.js";
import bcrypt from "bcrypt";

let userTable = client.user;

async function getUsers() {
  // Fetch all users
  const allUsers = await userTable.findMany();
  return allUsers;
}

async function getSingleUser(userId) {
  try {
    const user = await userTable.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error}`);
  } finally {
    await client.$disconnect();
  }
}

async function VerifyUser(email, password) {
  try {
    const user = await userTable.findUnique({
      where: {
        email: email,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error fetching user: ${error}`);
  } finally {
    await client.$disconnect();
  }
}

async function CreateAdminUser(username, email, password) {
  const cryptPassword = await bcrypt.hash(password, 10);
  // Create a new user
  const newUser = await userTable.create({
    data: {
      username: username,
      email: email,
      password: cryptPassword,
      role: role.ADMIN,
    },
  });
  return newUser;
}

async function createStudent(fname, lname, age, email, password) {
  const username = lname;
  const cryptPassword = await bcrypt.hash(password, 10);
  const studentUser = await userTable.create({
    data: {
      username: username,
      email: email,
      password: cryptPassword,
      role: role.STUDENT,
      student: {
        create: {
          fname: fname ? fname : null,
          lname: lname,
          age: age,
        },
      },
    },
    include: {
      student: true,
    },
  });

  return studentUser;
}

export default getUsers;
export { CreateAdminUser, getSingleUser, VerifyUser, createStudent };
