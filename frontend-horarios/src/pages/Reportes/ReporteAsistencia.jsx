import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, Table, Tag, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { RangePicker } = DatePicker;

const ReporteAsistencia = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [docentes, setDocentes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar Selects (Docentes y Grupos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/grupos-form-data');
        setDocentes(response.data.docentes || []);
        setGrupos(response.data.grupos || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const params = {
      docente_id: values.docente_id,
      grupo_id: values.grupo_id,
      fecha_inicio: values.fechas ? values.fechas[0].format('YYYY-MM-DD') : null,
      fecha_fin: values.fechas ? values.fechas[1].format('YYYY-MM-DD') : null,
    };
    try {
      const response = await api.get('/reportes/asistencia-docente', { params });
      setData(response.data);
    } catch (error) {
      console.error('Error obteniendo reporte:', error);
    }
    setLoading(false);
  };

  const columns = [
    { 
      title: 'Fecha', 
      dataIndex: 'created_at', 
      key: 'fecha',
      render: (text) => text ? new Date(text).toLocaleString('es-ES') : 'N/A'
    },
    { 
      title: 'Docente', 
      render: (record) => record.horario?.grupo?.docente?.usuario?.name || 'N/A'
    },
    { 
      title: 'Materia', 
      render: (record) => record.horario?.grupo?.materia?.nombre || 'N/A'
    },
    { 
      title: 'Grupo', 
      render: (record) => record.horario?.grupo?.nombre_grupo || 'N/A'
    },
    { 
      title: 'Estado', 
      dataIndex: 'estado', 
      render: (estado) => {
        const color = estado === 'presente' ? 'green' : (estado === 'atraso' ? 'orange' : 'red');
        return <Tag color={color}>{estado?.toUpperCase()}</Tag>;
      }
    },
    { title: 'Hora Registro', dataIndex: 'hora_registro' },
  ];

  return (
    <Card 
      title="Reporte de Asistencia Docente"
      extra={
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      }
    >
      <Form form={form} layout="inline" onFinish={onFinish} style={{ marginBottom: 20 }}>
        <Form.Item name="docente_id">
          <Select placeholder="Todos los Docentes" style={{ width: 200 }} allowClear>
            {docentes.map(d => (
              <Select.Option key={d.id} value={d.id}>
                {d.usuario?.name || d.codigo_docente}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="grupo_id">
          <Select placeholder="Todos los Grupos" style={{ width: 200 }} allowClear>
            {grupos.map(g => (
              <Select.Option key={g.id} value={g.id}>
                {/* Usamos 'g.materia?.sigla' para evitar el crash si la materia es nula */}
                {`${g.materia?.sigla || 'SIN MATERIA'} - ${g.nombre_grupo || ''}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="fechas">
          <RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Buscar
          </Button>
        </Form.Item>
      </Form>
      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default ReporteAsistencia;
