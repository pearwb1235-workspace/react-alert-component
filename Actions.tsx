import { Button, ButtonTypeMap } from "@mui/material";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";

export type ActionProps = DefaultComponentProps<ButtonTypeMap> & {
  text?: string;
  component?: JSX.Element;
};

export type ActionsProps = DefaultComponentProps<ButtonTypeMap> & {
  actions: {
    [key: string]: ActionProps;
  };
};

export default function Actions({ actions, ...defaultProps }: ActionsProps) {
  return (
    <>
      {Object.keys(actions).map(
        (key, _index, _array, { text, component, ...props } = actions[key]) => (
          <Button key={key} {...defaultProps} {...props}>
            {component || text || key}
          </Button>
        )
      )}
    </>
  );
}
