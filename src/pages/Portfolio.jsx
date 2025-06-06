import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
} from "react-bootstrap";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  // krem hangat
  // krem hangat
 "#FF6B6B  ", // coklat abu
 "#4ECDC4  ", // beige lembut
 "#1A535C ", // krem keputihan
 "#FF9F1C ", // coklat muda
 "#6A4C93 ", // hijau segar untuk highlight
 "#1982C4 ", // merah lembut untuk kontras
 "#4ECDC4 ", // beige lembut
 "#1A535C ", // krem keputihan
 "#FF9F1C ", // coklat muda
 "#6A4C93 ", // hijau segar untuk highlight
 "#1982C4 ", // merah lembut untuk kontras
 "#F72585  ", // coklat muda
 "#720026  ", // hijau segar untuk highlight
 "#3CAEA3  ", // merah lembut untuk kontras
 "#A2D2FF   ", // merah lembut untuk kontras
];



export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hitung total nilai asset
  const totalAssetValue = portfolio.reduce((sum, p) => {
    const totalCoin = parseFloat(p.total_coin);
    const price = parseFloat(p.current_price);
    if (isNaN(totalCoin) || isNaN(price)) return sum;
    return sum + totalCoin * price;
  }, 0);

  // Data untuk PieChart, filter coin dengan nilai > 0
  const pieData = portfolio
    .map((p) => {
      const totalCoin = parseFloat(p.total_coin);
      const price = parseFloat(p.current_price);
      const value = isNaN(totalCoin) || isNaN(price) ? 0 : totalCoin * price;
      return {
        name: p.coin_name,
        value,
      };
    })
    .filter((d) => d.value > 0);

  const fetchPortfolio = async () => {
    try {
      const res = await axiosInstance.get("/portfolio");
      setPortfolio(res.data);
    } catch (err) {
      setError("Gagal mengambil portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    document.title = "Portofolio | Crypto App";
  }, []);

  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <div
      style={{
        minHeight: "100vh",
        paddingTop: 30,
      }}
    >
        
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    </div>
    );

  if (portfolio.length === 0)
    return (
      <div
      style={{
        backgroundColor: "#333446",
        minHeight: "100vh",
        paddingTop: 30,
        paddingBottom: 40,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container className="text-center">
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert
              variant="info"
              className="py-4"
              style={{
                backgroundColor: "#44475a",
                border: "none",
                fontSize: "1.2rem",
                color: "#EAEFEF",
              }}
            >
              <h4>Kamu belum punya portfolio crypto saat ini.</h4>
              <p>
                Mulailah eksplorasi dan beli koin favoritmu untuk membangun portfolio.
                Jangan lewatkan kesempatan investasi di dunia crypto!
              </p>
              <Button
                as={Link}
                to="/coins"
                variant="primary"
                size="lg"
                style={{ fontWeight: "600", marginTop: "1rem" }}
              >
                Lihat Daftar Coin
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
    );

  return (
    <div
    style={{
        backgroundColor: "#333446",
        minHeight: "100vh",
        paddingTop: 30,
        paddingBottom: 40,
    }}
  >
    <Container className="mt-0">
        <h3 className="mb-4"
          style={{ color: "#EAEFEF"}} // biru muda contoh

        >Portfolio Saya</h3>
      <Row className="mb-4">
        {/* Total Asset & Daftar Coin */}
        <Col md={4}>
          <Card className="p-3 text-center shadow-sm"
             style={{ backgroundColor: "#EAE4D5" , color: "#393E46", borderRadius: "15px"}} // biru muda contoh
          >
            <h5>Coin Asset</h5>
            <h2>
              ${totalAssetValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>

            <div className="mt-3 text-start">
              <h6>Coins Dimiliki:</h6>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {portfolio.map((p) => (
                  <div
                    key={p.id}
                    className="d-flex align-items-center mb-2"
                  >
                    <img
                      src={p.image_url}
                      alt={p.coin_name}
                      width={24}
                      height={24}
                      className="me-2 rounded-circle"
                    />
                    <div>
                      <strong>{p.coin_name}</strong>{" "}
                      <small className="text-muted">
                        ({p.total_coin !== undefined && !isNaN(p.total_coin)
                          ? Number(p.total_coin).toFixed(4)
                          : "-"}
                        )
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col md={8}>
          <Card style={{backgroundColor: "#EAE4D5", color: "#393E46", borderRadius: "15px", height: "310px"}} className="shadow-sm p-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Daftar Portfolio Detail */}
      <Row xs={1} md={2} lg={3} className="g-4">
  {portfolio.map((p) => (
    <Col key={p.id}>
      <Card
        className="h-100 shadow-sm"
        style={{
          borderRadius: "15px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
          backgroundColor: "#EAEFEF",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }}
      >
        <Card.Body className="d-flex flex-column">
          <div className="d-flex align-items-center mb-4">
            <img
              src={p.image_url}
              alt={p.coin_name}
              width={56}
              height={56}
              className="rounded-circle shadow-sm"
              style={{ objectFit: "cover" }}
            />
            <h5 className="mb-0 ms-3" style={{ color: "#222", fontWeight: "700" }}>
              {p.coin_name}
            </h5>
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small mb-1">Total Coin</div>
              <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                {p.total_coin !== undefined && !isNaN(p.total_coin)
                  ? Number(p.total_coin).toFixed(8)
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-muted small mb-1">Harga Sekarang</div>
              <div style={{ fontWeight: "600", fontSize: "1.1rem", color: "#28a745" }}>
                {p.current_price !== undefined && !isNaN(p.current_price)
                  ? `$${Number(p.current_price).toLocaleString()}`
                  : "-"}
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="text-muted small mb-1">Nilai Total</div>
            <div
              style={{
                fontWeight: "700",
                fontSize: "1.25rem",
                color: "#17a2b8",
                marginBottom: "1rem",
              }}
            >
              {p.total_coin !== undefined && p.current_price !== undefined
                ? `$${(Number(p.total_coin) * Number(p.current_price)).toFixed(2)}`
                : "-"}
            </div>

            <Button
              as={Link}
              to={`/coins/${p.coin_name}`}
              variant="primary"
              className="w-100"
              style={{ fontWeight: "600",backgroundColor: "#B8CFCE", borderColor: "#B8CFCE", color: "#333446" }}
            >
              Lihat Detail
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

      </Container>
      </div>

  );
}
