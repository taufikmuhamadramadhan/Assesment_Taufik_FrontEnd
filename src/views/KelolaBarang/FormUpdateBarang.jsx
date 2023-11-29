import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilShortText } from '@coreui/icons'

const FormUpdateBarang = () => {
  const { id } = useParams()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nama_barang: '',
    satuan: '',
    harga_satuan: '',
    stok: '',
  })

  useEffect(() => {
    // Mengambil data Semester dari API berdasarkan ID saat komponen dimuat
    const fetchData = async () => {
      try {
        const apiUrl = `http://localhost:8080/api/barang/${id}`
        const response = await axios.get(apiUrl, {
          withCredentials: true,
        })

        const BarangData = response.data
        console.log(BarangData.NamaBarang)
        // Mengatur data ke dalam state formData
        setFormData({
          nama_barang: BarangData.NamaBarang,
          satuan: BarangData.Satuan,
          harga_satuan: BarangData.HargaSatuan,
          stok: BarangData.Stok,
        })
      } catch (error) {
        console.error('Error fetching Semester data:', error)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Handle form submission here, e.g., send the formData to an API
    const apiUrl = `http://localhost:8080/api/barang/update/${id}`

    // Membuat objek newSemester
    const updateBarang = {
      NamaBarang: formData.nama_barang,
      Satuan: formData.satuan,
      HargaSatuan: formData.harga_satuan,
      Stok: formData.stok,
    }
    try {
      const response = await axios.put(apiUrl, updateBarang, {
        withCredentials: true,
      })
      // Menampilkan Sweet Alert saat berhasil menambah data
      Swal.fire({
        title: 'Berhasil',
        text: `Data Barang berhasil ditambahkan.`,
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          // Mengarahkan user ke kelola akademik Barang
          window.location.href = '/kelolaBarang/'
          console.log('Barang created successfully:', response.data)
        }
      })
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
        setMessage(resMessage)
      }
      setLoading(false)
    }
  }
  console.log(formData)
  return (
    <>
      <CCard>
        <CForm onSubmit={handleSubmit}>
          <CCardHeader>Form Update Barang</CCardHeader>
          <CCardBody>
            <CRow className="g-3">
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText id="nama_barang">
                    <CIcon icon={cilShortText} />
                  </CInputGroupText>
                  <CFormInput
                    name="nama_barang"
                    placeholder="Nama Barang"
                    floatingLabel="Nama Barang"
                    aria-describedby="nama_barang"
                    required
                    value={formData.nama_barang}
                    onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText id="satuan">
                    <CIcon icon={cilShortText} />
                  </CInputGroupText>
                  <CFormInput
                    name="satuan"
                    placeholder="Satuan Barang"
                    floatingLabel="satuan barang"
                    aria-describedby="satuan"
                    required
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText id="harga_satuan">
                    <CIcon icon={cilShortText} />
                  </CInputGroupText>
                  <CFormInput
                    name="harga_satuan"
                    placeholder="Harga Satuan Barang"
                    floatingLabel="Harga Satuan Barang"
                    aria-describedby="harga_satuan"
                    required
                    value={formData.harga_satuan}
                    onChange={(e) => setFormData({ ...formData, harga_satuan: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText id="Stok">
                    <CIcon icon={cilShortText} />
                  </CInputGroupText>
                  <CFormInput
                    name="Stok"
                    placeholder="Stok Barang"
                    floatingLabel="Stok barang"
                    aria-describedby="Stok"
                    required
                    value={formData.stok}
                    onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                  />
                </CInputGroup>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol xs={10}></CCol>
              <CCol md={1}>
                <Link to={`/kelolaBarang/`}>
                  <CButton color="secondary" variant="outline" className="ms-2" title="Back">
                    Back
                  </CButton>
                </Link>
              </CCol>
              <CCol xs={1}>
                {loading ? (
                  <CButton color="primary" variant="outline" type="submit" disabled>
                    <CSpinner color="info" size="sm" />
                  </CButton>
                ) : (
                  <CButton color="primary" variant="outline" type="submit">
                    Submit
                  </CButton>
                )}{' '}
              </CCol>
            </CRow>
            <CRow className="mt-2">
              {message && <p className="error-message alert alert-danger">{message}</p>}
            </CRow>
          </CCardFooter>
        </CForm>
      </CCard>
    </>
  )
}

export default FormUpdateBarang
