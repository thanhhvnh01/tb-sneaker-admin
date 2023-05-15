import { getErrorMessage } from '@api/handleApiError';
import {
  createProductGroupAPI,
  getBrandsAPI,
  getProductGroupDetailAPI,
  updateProductTypeAPI,
} from '@api/main';
import CustomDialog from '@components/CustomDialog';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import { RHFCheckbox } from '@components/hook-forms/RHFCheckbox';
import RHFSelect from '@components/hook-forms/RHFSelect';
import MultiImageUpload from '@components/multiImageUpload';
import UILoader from '@components/UILoader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography, useTheme } from '@mui/material';
import { arrayToSelectOptions } from '@utilities/utils';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';

const ProductTypeEditModal = ({ open, close, productType }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState()
  const intl = useIntl();
  // hooks
  const theme = useTheme();

  const [options, setOptions] = useState([]);

  const productTypeModalSchema = yup.object().shape({
    productGroupName: yup.string().required().max(128).trim(),
    brandId: yup.string().required().max(128).trim(),
    price: yup.number().required(),
    color: yup.string().required()
  });

  const defaultValues = {
    productGroupName: '',
    brandId: '',
    price: '',
    color: ''
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(productTypeModalSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = methods;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const brandRes = await getBrandsAPI();
      const options = arrayToSelectOptions(brandRes.data, 'brand_name', 'brand_id');
      setOptions(options);
      if (!!productType) {
        const res = await getProductGroupDetailAPI(productType.product_group_id);
        setData(res.data)
        reset({
          ...defaultValues,
          ...{
            productGroupName: res.data.product_group_name,
            brandId: res.data.brand_id,
            price: res.data.price,
            color: res.data.color
          },
        });
      }
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType, reset]);

  const onSubmit = async (data) => {
    try {
      if (!!productType) {
        await updateProductTypeAPI(productType.productTypeId, {
          productTypeNameEn: data.productTypeNameEn,
          productTypeNameRu: data.productTypeNameRu,
          categoryId: data.categoryId,
        });
      } else {
        await createProductGroupAPI({
          productGroupName: data.productGroupName,
          brandId: data.brandId,
          price: data.price,
          color: data.color,
        });
      }
      close('SAVED');
      enqueueSnackbar('Thành công !', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  return (
    <CustomDialog fullWidth open={open} onClose={close} maxWidth="sm">
      <UILoader open={isLoading} />
      <DialogTitle>
        {!productType
          ? "Tạo mới hãng sản phẩm"
          : "Cập nhật hãng sản phẩm"
        }
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box>
            <Grid container spacing={2.5}>
              <Grid item md={6}>
                <RHFTextField
                  name="productGroupName"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      Tên nhóm sản phẩm
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFSelect
                  name="brandId"
                  size="small"
                  options={options}
                  label={
                    <Box sx={{ display: 'flex' }}>
                      Hãng
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFTextField
                  name="price"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      Giá
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFTextField
                  name="color"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      Màu sản phẩm
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
            <Grid container columns={12}>
              <Grid item md={6}>
                <Box mt={1}>
                  <MultiImageUpload
                    file={`image`}
                    images={data?.images}
                    setIsLoading={setIsLoading}
                  />
                  <Stack>
                    <RHFCheckbox
                      name={`isBestSelling`}
                      label={<FormattedMessage id="label.isBestSelling" />}
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 5, mt: 1, mb: 1 }}>
          <Button variant="contained" type="submit" disabled={!isDirty || !isValid}>
            {!!productType ? intl.formatMessage({ id: 'button.update' }) : intl.formatMessage({ id: 'button.create' })}
          </Button>
          <Button variant="outlined" onClick={close}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default ProductTypeEditModal;
