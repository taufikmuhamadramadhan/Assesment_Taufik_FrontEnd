import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
  CFormInput,
  CInputGroup,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CInputGroupText,
} from '@coreui/react'
import { cilTrash, cilUserPlus, cilSearch, cilPen } from '@coreui/icons'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import '../../assets/css/style.css'

const KelolaDataDosenWali = () => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalDelete, setModalDelete] = useState(false) //Handle Klik Modal Delete
  const [selectedData, setSelectedData] = useState(null) //State untuk mengambil id dari table
  const [searchText, setSearchText] = useState('') //State untuk seatch
  const [BarangData, setBarangData] = useState([])
  //State untuk menampung data dosen
  useEffect(() => {
    // URL API yang akan diambil datanya
    const apiUrl = 'http://localhost:8080/api/barang/'

    // Menggunakan Axios untuk mengambil data dari API
    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        // Mengatur data dosen ke dalam state dosenData
        const BarangData = response.data.map((item) => {
          return {
            KodeBarang: item.KodeBarang,
            NamaBarang: item.NamaBarang,
            Satuan: item.Satuan,
            HargaSatuan: item.HargaSatuan,
            Stok: item.Stok,
          }
        })

        console.log(BarangData)

        // Set state dosenWaliData setelah mendapatkan data yang telah diubah
        setBarangData(BarangData)
      })
      .catch((error) => {
        // Handle error jika terjadi kesalahan saat mengambil data dari API
        console.error('Error fetching data:', error)
      })
  }, [])

  const handleDeleteModal = (data) => {
    // Handle saat tombol hapus diklik
    setSelectedData(data) //Mengambil data id saat ingin menghapus
    setModalDelete(true) // Menampilkan modal
  }

  const handleDelete = (id) => {
    setLoading(true)
    // URL API untuk menghapus data semester dengan id tertentu
    const apiUrl = `http://localhost:8080/api/barang/destroy/${id}`

    // Menggunakan Axios untuk mengirim permintaan DELETE
    axios
      .delete(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        // Handle ketika data berhasil dihapus
        console.log('Data berhasil dihapus:', response.data)

        setBarangData((prevData) => prevData.filter((barang) => barang.KodeBarang !== id))

        // Tutup modal setelah berhasil menghapus
        setModalDelete(false)
        // Menampilkan Sweet Alert saat berhasil menghapus data
        Swal.fire({
          title: 'Berhasil',
          text: `Data Barang Wali berhasil dihapus.`,
          icon: 'success',
          confirmButtonText: 'OK',
        })
      })
      .catch((error) => {
        // Handle error jika terjadi kesalahan saat menghapus data
        console.error('Error deleting data:', error)
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
        setLoading(false)
        setMessage(resMessage)
      })
  }

  const handleSearchChange = (e) => {
    //Handle search saat di ketik
    setSearchText(e.target.value)
  }
  const filteredData = BarangData.filter((data) => {
    //Search filter data
    return (
      searchText === '' ||
      data.NamaBarang.toLowerCase().includes(searchText.toLowerCase()) ||
      data.Satuan.toLowerCase().includes(searchText.toLowerCase()) ||
      data.HargaSatuan.toLowerCase().includes(searchText.toLowerCase()) ||
      data.Stok.toLowerCase().includes(searchText.toLowerCase())
    )
  })
  // console.log(selectedData)
  return (
    <div>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <div className="fw-bold mt-3 mb-5 title-page">Daftar Barang</div>
              <CForm className="mb-3">
                <CRow>
                  <CCol md={8} xs={6}>
                    <CRow>
                      <CCol md={2}>
                        <Link to={'/kelolaBarang/create/'} className="link-card">
                          <CButton variant="outline" color="dark">
                            <CIcon icon={cilUserPlus} className="mx-2" />
                            Create
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={4} xs={6}>
                    <CInputGroup className="search-input">
                      <CFormInput
                        placeholder="Search"
                        value={searchText} // Mengikat nilai pencarian ke state searchText
                        onChange={handleSearchChange}
                      />
                      <CInputGroupText id="tanggal-awal">
                        <CIcon icon={cilSearch} />
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>
              </CForm>
              <CTable striped bordered responsive className="mt-2">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Nama Barang</CTableHeaderCell>
                    <CTableHeaderCell>Satuan</CTableHeaderCell>
                    <CTableHeaderCell>Harga per Satuan</CTableHeaderCell>
                    <CTableHeaderCell>Stok</CTableHeaderCell>
                    <CTableHeaderCell>Aksi</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No Data
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((data) => (
                      <CTableRow key={data.KodeBarang}>
                        <CTableDataCell>{data.NamaBarang}</CTableDataCell>
                        <CTableDataCell>{data.Satuan}</CTableDataCell>
                        <CTableDataCell>Rp. {data.HargaSatuan}</CTableDataCell>
                        <CTableDataCell>{data.Stok}</CTableDataCell>
                        <CTableDataCell>
                          <CCol>
                            <Link to={`/kelolaBarang/update/${data.KodeBarang}`}>
                              <CButton
                                color="primary"
                                variant="outline"
                                className="ms-2"
                                title="Ubah Data Dosen"
                              >
                                <CIcon icon={cilPen} />
                              </CButton>
                            </Link>
                            <CButton
                              color="danger"
                              variant="outline"
                              className="ms-2"
                              title="Hapus Data Dosen"
                              onClick={() => handleDeleteModal(data)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CCol>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Modal Delete */}
      <CModal
        backdrop="static"
        visible={modalDelete}
        onClose={() => {
          setModalDelete(false)
          setMessage('')
          setLoading(false)
        }}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="DeleteModal">Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Yakin ingin delete {selectedData ? selectedData.NamaBarang : ''} ?</CModalBody>
        <CModalFooter>
          <CRow className="mt-2">
            {message && (
              <p className="alert alert-danger" style={{ padding: '5px' }}>
                {message}
              </p>
            )}
          </CRow>
          <CButton
            color="secondary"
            onClick={() => {
              setModalDelete(false)
              setMessage('')
              setLoading(false)
            }}
          >
            Close
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(selectedData.KodeBarang)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default KelolaDataDosenWali
