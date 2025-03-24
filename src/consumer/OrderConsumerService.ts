import { QueueModel } from "../model/QueueModel";
import { EmailService } from "../service/EmailService";
import { startConsumer } from "./startConsumer";


const process = async (queueItem: QueueModel) => {
    if (queueItem.operationType === 'create') {
    } else if (queueItem.operationType === 'update') {
        console.log('Updating order:', queueItem.data);
    } else if (queueItem.operationType === 'delete') {
        console.log('Deleting order:', queueItem.data);
    } else {
        throw new Error('Invalid operation type ' + JSON.stringify(queueItem));
    }
}
const start = async () => {
    startConsumer("order", process)
}

export default { start }