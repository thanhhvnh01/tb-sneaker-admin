import Iconify from '@components/iconify';
import MenuPopover from '@components/MenuPopover';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, MenuItem } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const CoverMoreActions = ({ handleOpenEditModal, item, handleSetEnabled, handleDelete }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify sx={{ display: 'block' }} icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 190,
          boxShadow: 1,
        }}
      >
        <MenuItem
          onClick={() => {
            handleOpenEditModal(item);
            handleClose();
          }}
        >
          <VisibilityIcon sx={{ mr: 2, width: 20, height: 20 }} />
          Xem chi tiết
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default CoverMoreActions;
