import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nano = customAlphabet(alphabet, 6);

export function createCustomerId() {
  return `CUST-${nano()}`;
}

export function createProductId() {
  return `PROD-${nano()}`;
}

export function createOrderId() {
  return `ORD-${nano()}`;
}

export function createCategoryId() {
  return `CAT-${nano()}`;
}
