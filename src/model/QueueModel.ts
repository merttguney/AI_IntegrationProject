export interface QueueModel {
  data: any;
  websiteId: string;
  operationType: "create" | "update" | "delete";
}
