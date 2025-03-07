import React, { createContext, useContext, useState } from "react";
// import { Snackbar, SnackbarProps, Text } from "react-native-paper";

// interface SnackbarContextProps extends SnackbarProps {
//   message: string;
//   showMessage: (message: string) => void;
// }

// const SnackbarContext = createContext<SnackbarContextProps | undefined>(
//   undefined
// );

const SnackbarContext = createContext<{
  message: string | null;
  showMessage: (message: string) => void;
}>({ message: null, showMessage: (message: string) => {} });

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState("");

  const showMessage = (newMessage: string) => {
    setMessage(newMessage);
  };

  return (
    <SnackbarContext.Provider value={{ message, showMessage }}>
      {/* {children}
      <Snackbar
        visible={!!message}
        duration={2000}
        onDismiss={() => setMessage("")}
        action={{
          label: "",
          icon: "close",
          onPress: () => {
            setMessage("");
          },
        }}
      >
        {message}
      </Snackbar> */}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
