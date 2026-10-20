'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { FlightsApi } from '@/lib/flights-api';
import { Airplane, Flight, Airport, City } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { AirEasyLogo } from '@/components/brand/AirEasyLogo';
import {
  Shield,
  Plane,
  Building2,
  MapPin,
  Users,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type AdminTab = 'AIRPLANES' | 'FLIGHTS' | 'AIRPORTS' | 'CITIES' | 'ROLES';

export default function AdminPortalPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAirlineStaff, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('AIRPLANES');
  const [loading, setLoading] = useState(false);

  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<AdminTab>('AIRPLANES');

  //Airplane Form
  const [airplaneModel, setAirplaneModel] = useState('');
  const [airplaneCapacity, setAirplaneCapacity] = useState('180');

  //City Form
  const [cityName, setCityName] = useState('');

  //Airport Form
  const [airportName, setAirportName] = useState('');
  const [airportCode, setAirportCode] = useState('');
  const [airportAddress, setAirportAddress] = useState('');
  const [airportCityId, setAirportCityId] = useState('');

  //Flight Form
  const [flightNumber, setFlightNumber] = useState('');
  const [flightAirplaneId, setFlightAirplaneId] = useState('');
  const [flightDepAirportId, setFlightDepAirportId] = useState('');
  const [flightArrAirportId, setFlightArrAirportId] = useState('');
  const [flightDepTime, setFlightDepTime] = useState('');
  const [flightArrTime, setFlightArrTime] = useState('');
  const [flightPrice, setFlightPrice] = useState('');
  const [flightGate, setFlightGate] = useState('');

  // Role Form
  const [roleUserId, setRoleUserId] = useState('');
  const [roleName, setRoleName] = useState('ADMIN');

  const [formLoading, setFormLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [planesData, flightsData, airportsData, citiesData] = await Promise.all([
        FlightsApi.getAirplanes().catch(() => []),
        FlightsApi.getFlights().catch(() => []),
        FlightsApi.getAirports().catch(() => []),
        FlightsApi.getCities().catch(() => []),
      ]);
      setAirplanes(planesData);
      setFlights(flightsData);
      setAirports(airportsData);
      setCities(citiesData);
    } catch (e: any) {
      toastError('Failed to load portal resources');
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (!isAirlineStaff) {
        toastError('Access denied: Staff or Admin privileges required');
        router.push('/');
      } else {
        loadData();
      }
    }
  }, [user, authLoading, isAirlineStaff, router, toastError, loadData]);

  const openCreateModal = (type: AdminTab) => {
    setModalType(type);
    if (type === 'FLIGHTS' && !flightDepTime) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      setFlightDepTime(`${tomorrowStr}T10:00`);
      setFlightArrTime(`${tomorrowStr}T12:30`);
    }
    setIsModalOpen(true);
  };

  const handleCreateAirplane = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await FlightsApi.createAirplane({
        modelNumber: airplaneModel,
        capacity: Number(airplaneCapacity),
      });
      success(`Airplane ${airplaneModel} added successfully!`);
      setAirplaneModel('');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Could not add airplane');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await FlightsApi.createCity({ cityName: cityName });
      success(`City ${cityName} created successfully!`);
      setCityName('');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Could not create city');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateAirport = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await FlightsApi.createAirport({
        airportName: airportName,
        airportCode: airportCode.toUpperCase(),
        address: airportAddress,
        cityId: Number(airportCityId),
      });
      success(`Airport ${airportCode} registered successfully!`);
      setAirportName('');
      setAirportCode('');
      setAirportAddress('');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Could not register airport');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const airplane = airplanes.find((p) => p.id === Number(flightAirplaneId));
    const totalSeats = airplane?.capacity || 180;

    try {
      await FlightsApi.createFlight({
        flightNumber,
        airplaneId: Number(flightAirplaneId),
        departureAirportId: Number(flightDepAirportId),
        arrivalAirportId: Number(flightArrAirportId),
        departureTime: new Date(flightDepTime).toISOString(),
        arrivalTime: new Date(flightArrTime).toISOString(),
        price: Number(flightPrice),
        boardingGate: flightGate || undefined,
        totalSeats,
      });
      success(`Flight ${flightNumber} scheduled successfully!`);
      setFlightNumber('');
      setFlightPrice('');
      setFlightGate('');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Could not schedule flight');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await FlightsApi.assignUserRole({
        userId: Number(roleUserId),
        roleName,
      });
      success(`Role ${roleName} granted to User #${roleUserId}!`);
      setRoleUserId('');
      setIsModalOpen(false);
    } catch (err: any) {
      toastError(err.message || 'Could not assign user role');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px', width: '100%' }}>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <AirEasyLogo size="lg" subtitle="Management Portal" />
          <Badge variant="primary" style={{ height: 'fit-content' }}>
            Staff &amp; Admin
          </Badge>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={() => loadData()} icon={<RefreshCw size={14} />}>
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openCreateModal(activeTab)}
            icon={<Plus size={16} />}
          >
            Add New {activeTab.slice(0, -1)}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {[
          { key: 'AIRPLANES', label: 'Fleet & Airplanes', icon: Plane },
          { key: 'FLIGHTS', label: 'Scheduled Flights', icon: Plane },
          { key: 'AIRPORTS', label: 'Airports', icon: Building2 },
          { key: 'CITIES', label: 'Cities', icon: MapPin },
          ...(isAdmin ? [{ key: 'ROLES', label: 'User RBAC Roles', icon: Users }] : []),
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: active ? 700 : 500,
                background: active ? 'var(--color-primary-subtle)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                border: active ? '1.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <Card style={{ padding: '24px' }}>
        {/* Tab 1: Airplanes */}
        {activeTab === 'AIRPLANES' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Fleet Inventory ({airplanes.length})</h3>
            </div>
            {airplanes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No aircraft registered yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px' }}>ID</th>
                      <th style={{ padding: '12px' }}>Model Number</th>
                      <th style={{ padding: '12px' }}>Passenger Capacity</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {airplanes.map((plane) => (
                      <tr key={plane.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>#{plane.id}</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {plane.modelNumber}
                        </td>
                        <td style={{ padding: '12px' }}>{plane.capacity} seats</td>
                        <td style={{ padding: '12px' }}>
                          <Badge variant="success" size="sm">Active</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Flights */}
        {activeTab === 'FLIGHTS' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Active Scheduled Flights ({flights.length})</h3>
            </div>
            {flights.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No flights scheduled yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px' }}>Flight #</th>
                      <th style={{ padding: '12px' }}>Route</th>
                      <th style={{ padding: '12px' }}>Aircraft</th>
                      <th style={{ padding: '12px' }}>Departure</th>
                      <th style={{ padding: '12px' }}>Arrival</th>
                      <th style={{ padding: '12px' }}>Seats Available</th>
                      <th style={{ padding: '12px' }}>Fare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((f) => (
                      <tr key={f.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>
                          {f.flightNumber}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>
                          {f.departureAirport?.airportCode || 'DEP'} &rarr; {f.arrivalAirport?.airportCode || 'ARR'}
                        </td>
                        <td style={{ padding: '12px' }}>{f.airplane?.modelNumber || `Aircraft #${f.airplaneId}`}</td>
                        <td style={{ padding: '12px' }}>
                          {new Date(f.departureTime).toLocaleDateString('en-IN')}{' '}
                          {new Date(f.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {new Date(f.arrivalTime).toLocaleDateString('en-IN')}{' '}
                          {new Date(f.arrivalTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>
                          {f.availableSeats} / {f.totalSeats}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 800 }}>
                          ₹{f.price.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Airports */}
        {activeTab === 'AIRPORTS' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Airports Directory ({airports.length})</h3>
            </div>
            {airports.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No airports registered yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px' }}>Code</th>
                      <th style={{ padding: '12px' }}>Airport Name</th>
                      <th style={{ padding: '12px' }}>City</th>
                      <th style={{ padding: '12px' }}>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {airports.map((airport) => (
                      <tr key={airport.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px' }}>
                          <Badge variant="primary" size="sm">{airport.airportCode}</Badge>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700 }}>{airport.airportName}</td>
                        <td style={{ padding: '12px' }}>{airport.city?.cityName || `City #${airport.cityId}`}</td>
                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{airport.address || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Cities */}
        {activeTab === 'CITIES' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Cities ({cities.length})</h3>
            </div>
            {cities.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No cities added yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {cities.map((city) => (
                  <div
                    key={city.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-muted)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <MapPin size={16} color="var(--color-primary)" />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{city.cityName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: User Roles */}
        {activeTab === 'ROLES' && isAdmin && (
          <div style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
              Assign System Access Roles
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Promote users to ADMIN or FLIGHT_COMPANY roles directly using user ID.
            </p>

            <form onSubmit={handleAssignRole} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Target User ID"
                type="number"
                placeholder="e.g. 2"
                required
                value={roleUserId}
                onChange={(e) => setRoleUserId(e.target.value)}
              />

              <Select
                label="Role to Grant"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                options={[
                  { value: 'ADMIN', label: 'ADMIN (Full System Privileges)' },
                  { value: 'FLIGHT_COMPANY', label: 'FLIGHT_COMPANY (Manage Flights & Aircraft)' },
                  { value: 'CUSTOMER', label: 'CUSTOMER (Standard User)' },
                ]}
              />

              <Button type="submit" variant="primary" loading={formLoading} style={{ marginTop: '8px' }}>
                Grant Role to User
              </Button>
            </form>
          </div>
        )}
      </Card>

      {/* Creation Modal for Active Resource */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add New ${modalType}`}
      >
        {modalType === 'AIRPLANES' && (
          <form onSubmit={handleCreateAirplane} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Aircraft Model Number"
              placeholder="e.g. Boeing 777-300ER"
              required
              value={airplaneModel}
              onChange={(e) => setAirplaneModel(e.target.value)}
            />
            <Input
              label="Passenger Capacity"
              type="number"
              min={10}
              max={600}
              required
              value={airplaneCapacity}
              onChange={(e) => setAirplaneCapacity(e.target.value)}
            />
            <Button type="submit" variant="primary" loading={formLoading} style={{ marginTop: '8px' }}>
              Save Airplane
            </Button>
          </form>
        )}

        {modalType === 'CITIES' && (
          <form onSubmit={handleCreateCity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="City Name"
              placeholder="e.g. Mumbai"
              required
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <Button type="submit" variant="primary" loading={formLoading} style={{ marginTop: '8px' }}>
              Save City
            </Button>
          </form>
        )}

        {modalType === 'AIRPORTS' && (
          <form onSubmit={handleCreateAirport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Airport Name"
              placeholder="e.g. Indira Gandhi International Airport"
              required
              value={airportName}
              onChange={(e) => setAirportName(e.target.value)}
            />
            <Input
              label="Airport Code (IATA)"
              placeholder="e.g. DEL"
              maxLength={4}
              required
              value={airportCode}
              onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
            />
            <Input
              label="Street Address / Terminal"
              placeholder="New Delhi, Delhi 110037"
              value={airportAddress}
              onChange={(e) => setAirportAddress(e.target.value)}
            />
            <Select
              label="City"
              required
              placeholder="Select City"
              value={airportCityId}
              onChange={(e) => setAirportCityId(e.target.value)}
              options={cities.map((c) => ({ value: c.id, label: c.cityName }))}
            />
            <Button type="submit" variant="primary" loading={formLoading} style={{ marginTop: '8px' }}>
              Save Airport
            </Button>
          </form>
        )}

        {modalType === 'FLIGHTS' && (
          <form onSubmit={handleCreateFlight} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Flight Number"
              placeholder="e.g. AE-302"
              required
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
            />
            <Select
              label="Aircraft"
              required
              placeholder="Select Aircraft"
              value={flightAirplaneId}
              onChange={(e) => setFlightAirplaneId(e.target.value)}
              options={airplanes.map((p) => ({
                value: p.id,
                label: `${p.modelNumber} (${p.capacity} seats)`,
              }))}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select
                label="Departure Airport"
                required
                placeholder="From"
                value={flightDepAirportId}
                onChange={(e) => setFlightDepAirportId(e.target.value)}
                options={airports.map((a) => ({
                  value: a.id,
                  label: `${a.airportCode} - ${a.airportName}`,
                }))}
              />
              <Select
                label="Arrival Airport"
                required
                placeholder="To"
                value={flightArrAirportId}
                onChange={(e) => setFlightArrAirportId(e.target.value)}
                options={airports.map((a) => ({
                  value: a.id,
                  label: `${a.airportCode} - ${a.airportName}`,
                }))}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Departure Date & Time"
                type="datetime-local"
                required
                value={flightDepTime}
                onChange={(e) => setFlightDepTime(e.target.value)}
              />
              <Input
                label="Arrival Date & Time"
                type="datetime-local"
                required
                value={flightArrTime}
                onChange={(e) => setFlightArrTime(e.target.value)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Base Ticket Fare (₹)"
                type="number"
                min={500}
                required
                value={flightPrice}
                onChange={(e) => setFlightPrice(e.target.value)}
              />
              <Input
                label="Boarding Gate"
                placeholder="e.g. Gate 12"
                value={flightGate}
                onChange={(e) => setFlightGate(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" loading={formLoading} style={{ marginTop: '8px' }}>
              Schedule Flight
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
