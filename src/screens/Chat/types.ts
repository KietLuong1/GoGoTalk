export type ChatInfoRouteParams = {
  chatId: string;
  chatName: string;
};

export type ChatInfoProps = {
  route: {
    params: ChatInfoRouteParams;
  };
};

export type ChatParams = {
  Chat: {
    id: string;
  };
};

export interface ChatsProps {
  setUnreadCount: (count: number) => void;
}
