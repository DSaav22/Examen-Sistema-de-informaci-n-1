import React, { useState } from 'react';
import { Card, Form, Select, Button, Table, TimePicker, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import api from '../../services/api';
import dayjs from 'dayjs';

const diasSemana = [
  { id: 1, nombre: 'Lunes' }, 
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' }, 
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' }, 
  { id: 6, nombre: 'Sábado' }, 
  { id: 7, nombre: 'Domingo' },
];

const AulasDisponibles = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const params = {
      dia_semana: values.dia_semana,
      hora_inicio: values.rango_hora[0].format('HH:mm'),
      hora_fin: values.rango_hora[1].format('HH:mm'),
    };
    try {
      const response = await api.get('/reportes/aulas-disponibles', { params });
      setData(response.data);
    } catch (error) {
      console.error('Error obteniendo aulas disponibles:', error);
    }
    setLoading(false);
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Edificio', dataIndex: 'edificio', key: 'edificio' },
    { title: 'Capacidad', dataIndex: 'capacidad', key: 'capacidad' },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
  ];

  return (
    <Card 
      title="Reporte de Aulas Disponibles"
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
        <Form.Item 
          name="dia_semana" 
          rules={[{ required: true, message: 'Seleccione un día' }]}
        >
          <Select placeholder="Día de la semana" style={{ width: 200 }}>
            {diasSemana.map(d => (
              <Select.Option key={d.id} value={d.id}>
                {d.nombre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item 
          name="rango_hora" 
          rules={[{ required: true, message: 'Seleccione un rango' }]}
        >
          <TimePicker.RangePicker format="HH:mm" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Buscar Aulas
          </Button>
        </Form.Item>
      </Form>
      {data.length > 0 && (
        <Alert 
          message={`Se encontraron ${data.length} aula(s) disponible(s).`} 
          type="success" 
          style={{ marginBottom: 20 }} 
        />
      )}
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

export default AulasDisponibles;
