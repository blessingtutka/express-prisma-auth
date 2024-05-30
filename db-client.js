import { PrismaClient, Role } from "@prisma/client";

const role = Role;
const client = new PrismaClient();

export default client;

export { role };
