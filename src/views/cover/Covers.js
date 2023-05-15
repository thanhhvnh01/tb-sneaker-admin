import { getErrorMessage } from '@api/handleApiError';
import { deleteCoverAPI, getAllOrdersAPI, getCoversAPI, setEnabledCoverAPI } from '@api/main';
import Iconify from '@components/iconify';
import Label from '@components/label';
import Scrollbar from '@components/scrollbar';
import SearchInput from '@components/SearchInput';
import TableHeader from '@components/TableComponent/TableHeader';
import UILoader from '@components/UILoader';
import {
  Box,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,

  TableRow,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CoverEditModal from './CoverEditModal';
import CoverMoreActions from './CoverMoreActions';

const TABLE_HEAD = [
  { id: 'id', label: 'STT', align: 'center' },
  { id: 'coverName', label: 'Tên khách hàng', align: 'left' },
  { id: 'status', label: 'Email', algin: 'left' },
  { id: 'status', label: 'Địa chỉ', algin: 'left' },
  { id: 'status', label: 'SĐT', algin: 'left' },
  { id: 'status', label: 'Ngày đặt', algin: 'left' },
  { id: 'status', label: 'Tổng giá tiền', algin: 'left' },
  { id: 'status', label: 'Ghi chú', algin: 'left' },
  { id: 'more' },
];

const Covers = ({ handleError403 }) => {
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState();

  const [editModalOpen, setEditModalOpen] = useState(false);


  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersAPI();
      setData(response.data);
      // setTotalRows(response.data.paging.totalItem);
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageSize, pageNumber + 1, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToggle, pageSize, pageNumber, keyword]);

  const handleOpenEditModal = (item) => {
    setSelectedData(item);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = (modalResult) => {
    setEditModalOpen(!editModalOpen);
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle);
    }
  };

  const handleSearch = async (value) => {
    setPageNumber(0);
    setKeyword(value);
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Đơn hàng
          </Typography>
        </Stack>
        <Card>
          <UILoader open={isLoading} />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 3, py: 2 }}
          >
            <SearchInput onChange={handleSearch} />
          </Box>
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHeader headLabel={TABLE_HEAD} rowCount={data.length} />
                <TableBody>
                  {data?.map((item, index) => {
                    return (
                      <TableRow key={item.coverId} hover>
                        <TableCell padding="normal" align="center">
                          <Box>
                            <Typography>{pageNumber * pageSize + index + 1}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography sx={{ mt: 2, ml: 2 }} height="25px" variant="subtitle2" noWrap>
                              {item.customer_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography sx={{ mt: 2, ml: 2 }} height="25px" variant="subtitle2" noWrap>
                              {item.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography sx={{ mt: 2, ml: 2 }} height="25px" variant="subtitle2" noWrap>
                              {item.address}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography sx={{ mt: 2, ml: 2 }} height="25px" variant="subtitle2" noWrap>
                              {item.phoneNumber}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography sx={{ mt: 2, ml: 2 }} height="25px" variant="subtitle2" noWrap>
                              {item.createdAt}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography sx={{ mt: 2, ml: 2 }} height="25px" variant="subtitle2" noWrap>
                              {item.total_price}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography sx={{ mt: 2, ml: 2 }} height="25px" variant="subtitle2" noWrap>
                              {item.note}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell align="right">
                          <CoverMoreActions
                            handleOpenEditModal={() => {
                              handleOpenEditModal(item);
                            }}
                            
                            item={item}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          
        </Card>
        {editModalOpen && <CoverEditModal open={editModalOpen} close={handleCloseEditModal} cover={selectedData} />}
      </Container>
    </>
  );
};

export default Covers;
