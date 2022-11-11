import React from 'react';
import type { ITableData } from '@/types/statistics';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function SubjectCountTable({ subjectNames, subjectCountMap }: ITableData) {
  const rows = subjectNames.map((name) => ({
    name,
    count: subjectCountMap[name],
  }));

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{ maxHeight: '300px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='center'>과목명</TableCell>
              <TableCell align='center'>담은 인원</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='center'>{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default React.memo(SubjectCountTable);
