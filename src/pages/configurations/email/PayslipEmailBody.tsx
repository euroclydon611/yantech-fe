import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const PayslipEmailBody: React.FC = () => {
  const [editorValue, setEditorValue] = useState("");
  const [previewValue, setPreviewValue] = useState("");
  const csrfToken = useSelector((state: RootState) => state.auth.csrfToken);

  const axiosConfig = {
    withCredentials: true,
    headers: { "x-csrf-token": csrfToken },
  };

  useEffect(() => {
    async function getConfig() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_PUBLIC_SERVER_URI}/configs/email-extra/find`,
          undefined,
          axiosConfig,
        );
        const result = response.data.data;
        if (result) {
          const parsedResult = result
            .replace(/<br>/g, "\n")
            .replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "\t")
            .replace(/&nbsp;/g, " ");
          setEditorValue(parsedResult);
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.error ||
            "An error occurred while fetching data."
        );
      }
    }

    getConfig();
  }, []);

  const saveConfig = (val: string) => {
    axios
      .post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URI}configs/email-extra/update`,
        { extrasEmailInfo: val },
        axiosConfig,
      )
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error ||
            "An error occurred while processing your request."
        );
      });
  };

  const msgPart1 = `Dear Twaann Hendrikx,
                
Please find attached your payslip for the month of September 2023.

Attachment: Hendrikx_Twaann_643184_September_2023.pdf

If you have any questions or concerns regarding your payslip or any other payroll-related matters, please do not hesitate to contact our payroll department at support@payroll.app.
`;

  const msgPart2 = `Best regards,
Jodi Construction`;

  useEffect(() => {
    const preview = msgPart1 + editorValue + "\n" + msgPart2;
    setPreviewValue(preview);
  }, [editorValue]);

  const handleSave = () => {
    const val = editorValue
      .replace(/\n/g, "<br>")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/\s/g, "&nbsp;");
    saveConfig(val);
  };

  return (
    <>
      <h1 className="text-[18px] mb-3 font-bold p-4">
        Payslip Email Body Config
      </h1>
      <div className="flex justify-center gap-5 mt-4 max-md:block md:w-[95%] mx-auto">
        <div className="w-[50%] max-md:w-full rounded-md p-2">
          <h5 className="underline text-[#313a46] mb-1">Editor</h5>
          <div className="max-h-[650px] overflow-y-auto">
            <textarea
              name="editor"
              id="editor"
              className="w-full py-2 px-4  border shadow-sm custom-sider"
              rows={20}
              placeholder="Type your text here"
              value={editorValue}
              onChange={(e) => setEditorValue(e.target.value)}
            ></textarea>
            <div className="mb-4 mt-4">
              <button
                id="save"
                className="bg-[#727cf5] hover:bg-[#5b65c7] min-h-[30px] w-[65px] text-[13px] font-[600] text-white transition-all duration-300"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="w-[50%] max-md:w-full p-2">
          <h5 className="underline text-[#313a46] mb-1">Preview</h5>
          <textarea
            name="preview"
            id="preview"
            className="w-full py-2 px-4 bg-[#eef2f7] border rounded-md custom-sider"
            rows={20}
            readOnly
            value={previewValue}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default PayslipEmailBody;
