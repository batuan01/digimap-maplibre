import cogoToast, { CTReturn } from "cogo-toast";
import styled, { keyframes } from "styled-components";
import { Icons } from "./DGMIcons";

// Define the possible types for the toast notifications
type ToastType = "success" | "loading" | "info" | "warn" | "error";

type Message = string | React.ReactNode;

const ToastWrapper = styled.div`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  z-index: calc(var(--max-toasts) - var(--index));
  bottom: 0;
  display: flex;
  flex: 1 200px;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  animation: 0.2s ease-out backwards toast-appear-toast_t1udhovq,
    0.3s ease-in var(--duration) forwards toast-disappear-toast_t1udhovq;
  background: var(--digimap-toastBackground-color, #ffffff);
  box-shadow: 0 4px 8px #0000001a;
  font-size: var(--digimap-base-font-size, 12px);
  line-height: var(--digimap-base-font-size, 12px);
  pointer-events: auto;
  transform: translateY(var(--translate-y));
  transition: transform 0.2s;
  white-space: nowrap;
  height: 40px;
  padding: 0 15px;
  border-radius: 15px;
  background-color: #000;
  color: #ffffff;
  font-weight: var(--digimap-heading-font-weight, 600);
  padding-left: 15px;
  animation-iteration-count: 0, 1;
  padding-right: 15px;
  --duration: 5000ms;
  --index: 0;
`;

const TextWrapper = styled.span`
  font-family: Inter, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: var(--digimap-base-font-size, 12px);
  line-height: var(--digimap-base-font-size, 12px);
  pointer-events: auto;
  white-space: nowrap;
  color: var(--digimap-toastTextSites-color, #ffffff);
  font-weight: var(--digimap-heading-font-weight, 600);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
`;

const IconWrapper = styled.div`
  font-size: var(--digimap-base-font-size, 12px);
  line-height: var(--digimap-base-font-size, 12px);
  pointer-events: auto;
  white-space: nowrap;
  font-weight: var(--digimap-heading-font-weight, 600);
  --duration: 5000ms;
  --index: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  display: flex;
  width: 20px;
  height: 100%;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  margin-right: 10px;
  color: var(--digimap-toastIconSites-color, #0099ff);
`;

const showToast = (type: ToastType, message: Message, duration?: number): CTReturn => {
  return cogoToast[type](
    <ToastWrapper>
      <IconWrapper>
        {
          {
            success: <Icons.SuccessCircle />,
            error: <Icons.ErrorCircle />,
            info: <></>,
            warn: <></>,
            loading: <></>,
          }[type]
        }
      </IconWrapper>
      <TextWrapper>{message}</TextWrapper>
    </ToastWrapper>,
    { position: "bottom-center", renderIcon: () => <></>, heading: "", bar: { size: "0" }, hideAfter: duration ?? 2 }
  );
};

export const showSuccessToast = (message: Message, duration?: number): CTReturn =>
  showToast("success", message, duration);
export const showErrorToast = (message: Message, duration?: number): CTReturn => showToast("error", message, duration);
export const showInfoToast = (message: Message, duration?: number): CTReturn => showToast("info", message, duration);
export const showWarnToast = (message: Message, duration?: number): CTReturn => showToast("warn", message, duration);

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinLoading = styled.div<{ bg?: string; size?: string }>`
  font-size: var(--digimap-base-font-size, 12px);
  line-height: var(--digimap-base-font-size, 12px);
  pointer-events: auto;
  white-space: nowrap;
  --translate-y: calc(calc(var(--index) * calc(var(--toast-height) + 10px)) * -1);
  --translate-y-offset: calc(var(--translate-y) + 10px);
  --toast-height: 50px;
  font-weight: var(--digimap-heading-font-weight, 600);
  --duration: 1ms;
  --index: 0;
  color: #ffffff;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  --spinner-translate: 0;
  background-color: ${(props) => (props.bg ? props.bg : "#ffffff")};
  width: ${(props) => (props.size ? props.size : "12px")};
  height: ${(props) => (props.size ? props.size : "12px")};
  mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAApNJREFUSA2tlUtLlFEYgEe7mtFFQ8NLFBG1SJAwahtiLVy5ceVSEPQH1LZf0Lp9FO1bdYNyI7gyBFcS2kAzilYq3sfxeYZ55Zv6FGfohWfOd97vnPd23u9MXeZoaeb1Q7gPHXAFzsAS5GACxiEPqVKXqs1kmtAPQi+cAtedToz1PJ8ExxPwDl7CAlRImoN7rBiF86ABHTiGAzMIh8n3O+ifwWc4EL0n5TGTYQijvjNSxbUadozInUeGZ3nuh1WYgpIkM+hGMwYajAgdrfUn+AaLoLTCAxiAOxCZxL4RdB+gZMjxEjwHo4hS8Jh5DR9hz0mKaNizegoNEI7Wee6FXJTISG6AUgDr+QImoAiHie+mwZJow/PRps4uwnsnRj8Epqc4voVJJ8eULOtW4BFYYjPpgjc+3IWI2sh/wFeoVl6xYQ48dDGLfjOwc/ygQqz595hUMVouS9QHBm4l6k3HWpnBLqicgVrlCxujSbR1Swd+UDpQYRS/oVaZZ2MWwlZBB9Zdxf+QTYw8SRgq6sAvz7vH6JULEB9USVHFjzZskgPRQR4ayxoXXIdaHdg9HrB2rErByWxZERnYtrWUzD0esDbtTmXPhzXwHrKLxEUbYGbVyDkWWwkdadfqbPmwDXZSCyh2VAf8BM/nOOJH5Y0QopMt2I5U/KO4DZZJB47XwEX+ex0mGroMV8sLwp56gyuGwiyW4SZ4c8bt2cZzO7jBNeqtsRHbeZ1g9krsMbhfYPv/c5gecA+4yAVuitFszE5Hjva872OMdXagF19JIoOYWyozMTI3J0tmA6gLvXPfO1cc/XOqOLe/HbjwD8yCXRD3VNJROEgatiRZMJsKsbZHia3nAdphtq8fkiWyXJbBe8uM1aXKPouNnz2Bm1kwAAAAAElFTkSuQmCC);
  mask-size: ${(props) => (props.size ? props.size : "12px")};
  animation: ${spin} 0.8s linear infinite;
`;

export default SpinLoading;

const showToastLoading = (message: Message, duration?: number): CTReturn => {
  return cogoToast.loading(
    <ToastWrapper>
      <IconWrapper>
        <SpinLoading />
      </IconWrapper>
      <TextWrapper>{message}</TextWrapper>
    </ToastWrapper>,
    { position: "bottom-center", renderIcon: () => <></>, heading: "", bar: { size: "0" }, hideAfter: duration ?? 2 }
  );
};

export const showLoadingToast = (message: Message, duration?: number): CTReturn => showToastLoading(message, duration);
