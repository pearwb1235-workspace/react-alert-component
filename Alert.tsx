import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Actions, { ActionsProps } from "./Actions";

export type AlertData = {
  title?: string;
  content: string;
  actions?: ActionsProps["actions"];
};

export type CloseHandler = () => void;

const AlertContext = React.createContext<
  (newAlertData: AlertData) => CloseHandler
>(() => () => {});

const defualtAlertActions: AlertData["actions"] = {
  確認: { variant: "contained" },
};

// ANCHOR hook
export function useAlert() {
  const alertDataDispatch = React.useContext(AlertContext);
  return function alert(
    ...parms:
      | [Required<AlertData>["content"]]
      | [Required<AlertData>["title"], Required<AlertData>["content"]]
      | [
          Required<AlertData>["title"],
          Required<AlertData>["content"],
          Required<AlertData>["actions"]
        ]
  ): CloseHandler {
    if (parms.length === 1) {
      return alertDataDispatch({
        title: "通知",
        content: parms[0],
        actions: defualtAlertActions,
      });
    } else if (parms.length === 2) {
      return alertDataDispatch({
        title: parms[0],
        content: parms[1],
        actions: defualtAlertActions,
      });
    } else {
      return alertDataDispatch({
        title: parms[0],
        content: parms[1],
        actions: parms[2],
      });
    }
  } as {
    (content: Required<AlertData>["content"]): (
      newAlertData: AlertData
    ) => CloseHandler;
    (
      title: Required<AlertData>["title"],
      content: Required<AlertData>["content"]
    ): CloseHandler;
    (
      title: Required<AlertData>["title"],
      content: Required<AlertData>["content"],
      actions: Required<AlertData>["actions"]
    ): CloseHandler;
  };
}

// ANCHOR Alert Provider
export function AlertProvider({ children }: React.PropsWithChildren<{}>) {
  const [alertDatas, setAlertDatas] = React.useState<
    {
      close: CloseHandler;
      data: AlertData;
    }[]
  >([]);
  const alertDataDispatch = React.useCallback(
    (newAlertData: AlertData) => {
      let isDelete = false;
      const close = () => {
        if (isDelete) return;
        isDelete = true;
        setAlertDatas((originAlertDatas) =>
          originAlertDatas.filter(
            (originAlertData) => originAlertData.data !== newAlertData
          )
        );
      };
      setAlertDatas((originAlertDatas) => [
        ...originAlertDatas,
        { close, data: newAlertData },
      ]);
      return close;
    },
    [setAlertDatas]
  );
  const currentAlertData = alertDatas[alertDatas.length - 1];
  return (
    <AlertContext.Provider value={alertDataDispatch}>
      {children}
      <AlertModal
        data={currentAlertData?.data}
        onClose={currentAlertData?.close}
      />
    </AlertContext.Provider>
  );
}

// ANCHOR Alert Modal
function AlertModal({
  data,
  onClose,
}: {
  data?: AlertData;
  onClose?: CloseHandler;
}) {
  return (
    <Dialog open={Boolean(data)} fullWidth maxWidth="xs">
      <DialogTitle>{data?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{data?.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {data && data.actions ? (
          <Actions actions={data.actions} onClick={onClose} />
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
