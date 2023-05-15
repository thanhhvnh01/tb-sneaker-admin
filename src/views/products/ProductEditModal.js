import { getErrorMessage } from '@api/handleApiError';
import {
  createProductAPI,
  getProductDetailAPI,
  getProductGroupIdAPI,
  updateProductAPI,
} from '@api/main';
import CustomDialog from '@components/CustomDialog';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import RHFSelect from '@components/hook-forms/RHFSelect';

import UILoader from '@components/UILoader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid,  useTheme } from '@mui/material';

import { arrayToSelectOptions} from '@utilities/utils';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import {  useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';

const ProductEditModal = ({ open, close, product }) => {
  // hooks
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const defaultValues = {
    productGroupName: '',
    productName: '', 
    quantity: '',
    size: ''
  };

  const FormSchema = yup.object().shape({
    productGroupName: yup.string().required(),
    size: yup.number().required(),
    quantity: yup.number().required()
  });

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(FormSchema),
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isDirty, isValid },
  } = methods;
  const productGroupName = watch('productGroupName')

  useEffect(()=>{
    setValue('productName', options[productGroupName-2]?.label)
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[productGroupName])

  console.log(options);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const productGroupRes = await getProductGroupIdAPI()
      const options = arrayToSelectOptions(productGroupRes.data, 'product_group_name', 'product_group_id');
      setOptions(options)
      if (!!product) {
        const res = await getProductDetailAPI(product.product_id);
        reset({
          ...defaultValues,
          ...{
            productGroupName: res.data.product_group_id,
            size: res.data.size,
            quantity: res.data.quantity
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
  }, [product, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = {
      productGroupNameEn: data.productGroupNameEn,
      productGroupNameRu: data.productGroupNameRu,
      productTypeId: data.productTypeId,
      materialTypeId: data.materialTypeId,
      hairStyleId: data.hairStyleId,
      measureUnitLengthId: data.measureUnitLengthId,
      fromLength: data.fromLength,
      toLength: data.toLength,
      measureUnitWeightId: data.measureUnitWeightId,
      weight: data.weight,
      origin: data.origin,
      packingRuleId: data.packingRuleId,
      videoUrl: data.videoUrl,
      descriptionEn: data.descriptionEn,
      descriptionRu: data.descriptionRu,
      colors: data.colors,
    };
    try {
      if (!!product) {
        await updateProductAPI(product.productGroupId, formData);
      } else {
        await createProductAPI(formData);
      }
      close('SAVED');
      enqueueSnackbar('Thành công !', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomDialog fullWidth open={open} onClose={close} maxWidth="sm">
      <UILoader open={isLoading} />
      <DialogTitle>
        {!!product ? <FormattedMessage id="label.updateProduct" /> : <FormattedMessage id="label.createProduct" />}
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box>
            <Grid container spacing={2.5}>
              <Grid item md={6}>
                <RHFSelect
                  name="productGroupName"
                  size="small"
                  options={options}
                  label={
                    <Box sx={{ display: 'flex' }}>
                      Tên nhóm sản phẩm
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFTextField
                  name="productName"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      Tên sản phẩm
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                  disabled
                />
              </Grid>
              <Grid item md={6}>
                <RHFTextField
                  name="quantity"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      Số lượng
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFTextField
                  name="size"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      Size
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit" disabled={!isValid || !isDirty}>
            {!!product ? intl.formatMessage({ id: 'button.update' }) : intl.formatMessage({ id: 'button.create' })}
          </Button>
          <Button variant="outlined" onClick={close}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default ProductEditModal;
