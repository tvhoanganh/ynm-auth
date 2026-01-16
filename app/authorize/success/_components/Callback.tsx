/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { OauthOptions } from "@/app/types/OauthOptions";
import { useEffect } from "react";

type CallbackProps = OauthOptions & {
  authorization_code: string;
};

export default function Callback({ data }: { data: CallbackProps }) {
  useEffect(() => {
    if (data.flow === "redirect") {
      window.location.href = `${data.redirect_uri}?code=${data.authorization_code}&state=${data.state}`;
      return;
    }

    window.opener.postMessage(
      {
        type: "oauth-code",
        code: data.authorization_code,
      },
      data.client_id
    );

    window.close();
  }, [data]);
  return <div>Callback with code: {data.authorization_code}</div>;
}
