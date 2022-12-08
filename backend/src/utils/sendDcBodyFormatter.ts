import { v4 as uuidv4 } from 'uuid';

interface Chat {
  type: string;
  message: string;
  sender: string;
}

interface FormattedChat {
  id: string;
  type: string;
  message: string;
  sender: string;
  fromId: string;
  timestamp: Date | undefined;
}

export function getChatBody(body: Chat, fromId: string) {
  const sendBody: FormattedChat = {
    id: '',
    fromId: '',
    timestamp: undefined,
    ...body,
  };
  sendBody.fromId = fromId;
  sendBody.timestamp = new Date();
  sendBody.id = uuidv4();
  return sendBody;
}
export function getCanvasBody(body, fromId) {
  return body;
}
