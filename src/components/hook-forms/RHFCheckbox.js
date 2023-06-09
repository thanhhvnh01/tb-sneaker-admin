// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";

// ----------------------------------------------------------------------

export function RHFCheckbox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMultiCheckbox({
  name,
  options,
  sx,
  getOptionLabel,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option) =>
          field.value.includes(option)
            ? field.value.filter((value) => value !== option)
            : [...field.value, option];

        return (
          <FormGroup sx={{ m: "0px !important", ...sx }}>
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => field.onChange(onSelected(option.value))}
                  />
                }
                label={
                  !!getOptionLabel ? getOptionLabel(option.label) : option.label
                }
                {...other}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
}
