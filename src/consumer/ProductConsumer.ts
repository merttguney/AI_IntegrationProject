import { QueueModel } from "../model/QueueModel";
import { startConsumer } from "./startConsumer";

const process = async (queueItem: QueueModel) => {
  if (queueItem.operationType === "create") {
    console.log("Creating product:", queueItem.data);
  } else if (queueItem.operationType === "update") {
    console.log("Updating product:", queueItem.data);
  } else if (queueItem.operationType === "delete") {
    console.log("Deleting product:", queueItem.data);
  } else {
    throw new Error("Invalid operation type " + JSON.stringify(queueItem));
  }
};
const start = async () => {
  startConsumer("product", process);
};

export default { start };
