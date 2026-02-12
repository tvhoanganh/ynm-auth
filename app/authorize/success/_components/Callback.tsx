"use client";

import { OauthOptions } from "@/app/types/OauthOptions";
import { useEffect } from "react";
import { FLOW_REDIRECT } from "@/constants/oauth";
import { Spinner } from "@/components/ui/Spinner";

type CallbackProps = OauthOptions & {
  authorization_code: string;
};

export default function Callback({ data }: { data: CallbackProps }) {
  useEffect(() => {
    if (data.flow === FLOW_REDIRECT) {
      window.location.href = `${data.redirect_uri}?code=${data.authorization_code}&state=${data.state}`;
      return;
    }

    window.opener.postMessage(
      {
        type: "oauth-code",
        code: data.authorization_code,
      },
      data.client_id,
    );

    window.close();
  }, [data]);

  return (
    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
      <Spinner size="sm" />
      <span>Đang chuyển hướng...</span>
    </div>
  );
}
