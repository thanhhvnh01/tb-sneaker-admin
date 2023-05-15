import { getErrorMessage } from '@api/handleApiError';
import { getOrderDetailsById } from '@api/main';
import CustomDialog from '@components/CustomDialog';
import UILoader from '@components/UILoader';
import { Box, Button, DialogActions, DialogTitle, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const CoverEditModal = ({ open, close, cover }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])



  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getOrderDetailsById(cover.order_id);
      setData(res.data)
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
  }, [cover]);

  return (
    <CustomDialog fullWidth open={open} onClose={close}>
      <UILoader open={isLoading} />
      <DialogTitle>
        Chi tiết đơn hàng
      </DialogTitle>

      <Stack spacing={1} sx={{ px: 5, mt: 2 }}>
        <Typography>Tên khách hàng: {data[0]?.customer_name} </Typography>
        <Typography>Địa chỉ: {data[0]?.address} </Typography>
        <Typography>Tổng giá: {data[0]?.total_price} </Typography>
        <Typography>Số điện thoại: {data[0]?.phoneNumber} </Typography>
      </Stack>


      <Typography sx={{ px: 3, mt: 2 }} fontWeight="bold">Sản phẩm:</Typography>
      <Stack direction="column" spacing={2} sx={{ px: 5, mt: 2 }}>
        {data?.map((i, idx) => {
          return (
            <Box borderBottom="1px black solid" display="flex" justifyContent="space-between">
              <Typography fontWeight="bold"> {idx + 1}</Typography>
              <Box>
                <Typography>Tên sản phẩm: {i.product_name + ' ' + i.size}</Typography>
                <Typography>Số lượng: {i.quantity}</Typography>
              </Box>
            </Box>
          )
        })}
      </Stack>
      <DialogActions sx={{ px: 5, mt: 1, mb: 1 }}>
        <Button variant="outlined" onClick={close}>
          <FormattedMessage id="button.cancel" />
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default CoverEditModal;
