import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "../../components/ui/Toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCities, useCreateCity, useUpdateCity, useDeleteCity, CITIES_KEY } from "../../hooks/queries/useCities";
import {
  createAreaApi,
  updateAreaApi,
  deleteAreaApi,
} from "../../api/areas.api";
import Modal from "../../components/ui/Modal";

const EMPTY = { ar: "", en: "" };

export default function Cities() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const { data: cities = [], isLoading: loading } = useCities();
  const createCity = useCreateCity();
  const updateCity = useUpdateCity();
  const deleteCity = useDeleteCity();

  const [cityModal, setCityModal] = useState(null);
  const [cityForm, setCityForm] = useState(EMPTY);
  const [cityEditId, setCityEditId] = useState(null);

  const [areaModal, setAreaModal] = useState(null);
  const [areaForm, setAreaForm] = useState(EMPTY);
  const [areaEditId, setAreaEditId] = useState(null);
  const [areaCityId, setAreaCityId] = useState(null);

  function openCityCreate() {
    setCityForm(EMPTY);
    setCityEditId(null);
    setCityModal("create");
  }
  function openCityEdit(city) {
    setCityForm({ ar: city.name.ar, en: city.name.en });
    setCityEditId(city.id);
    setCityModal("edit");
  }
  async function handleCitySave() {
    if (!cityForm.ar.trim() || !cityForm.en.trim())
      return showToast("أدخل الاسم بالعربي والإنجليزي", "error");
    setSaving(true);
    try {
      if (cityModal === "create") {
        await createCity.mutateAsync({ name: cityForm });
        showToast("تم إضافة المدينة");
      } else {
        await updateCity.mutateAsync({ id: cityEditId, data: { name: cityForm } });
        showToast("تم تحديث المدينة");
      }
      setCityModal(null);
    } catch {
      showToast("حدث خطأ", "error");
    } finally {
      setSaving(false);
    }
  }
  async function handleCityDelete(id) {
    setDeleting("city-" + id);
    try {
      await deleteCity.mutateAsync(id);
      showToast("تم حذف المدينة");
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحذف", "error");
    } finally {
      setDeleting(null);
    }
  }

  function openAreaCreate(cityId) {
    setAreaForm(EMPTY);
    setAreaEditId(null);
    setAreaCityId(cityId);
    setAreaModal("create");
  }
  function openAreaEdit(area, cityId) {
    setAreaForm({ ar: area.name.ar, en: area.name.en });
    setAreaEditId(area.id);
    setAreaCityId(cityId);
    setAreaModal("edit");
  }
  async function handleAreaSave() {
    if (!areaForm.ar.trim() || !areaForm.en.trim())
      return showToast("أدخل الاسم بالعربي والإنجليزي", "error");
    setSaving(true);
    try {
      if (areaModal === "create") {
        await createAreaApi({ city_id: areaCityId, name: areaForm });
        showToast("تم إضافة المنطقة");
      } else {
        await updateAreaApi(areaEditId, { city_id: areaCityId, name: areaForm });
        showToast("تم تحديث المنطقة");
      }
      setAreaModal(null);
      qc.invalidateQueries({ queryKey: CITIES_KEY });
    } catch {
      showToast("حدث خطأ", "error");
    } finally {
      setSaving(false);
    }
  }
  async function handleAreaDelete(areaId) {
    setDeleting("area-" + areaId);
    try {
      await deleteAreaApi(areaId);
      showToast("تم حذف المنطقة");
      qc.invalidateQueries({ queryKey: CITIES_KEY });
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحذف", "error");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <div className="page-head">
        <div>
          <h1>المدن</h1>
          <div className="sub">{cities.length} مدينة</div>
        </div>
        <button className="btn btn-p" onClick={openCityCreate}>
          <Plus size={15} /> مدينة جديدة
        </button>
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        {loading &&
          [1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 20px",
                gap: 10,
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 14,
                  borderRadius: 6,
                  background: "var(--line)",
                  animation: "pulse 1.2s ease infinite",
                }}
              />
              <div style={{ flex: 1 }} />
              <div
                style={{
                  width: 50,
                  height: 20,
                  borderRadius: 20,
                  background: "var(--line)",
                  animation: "pulse 1.2s ease infinite",
                }}
              />
            </div>
          ))}
        {!loading &&
          cities.map((city, i) => (
            <div
              key={city.id}
              style={{
                borderBottom:
                  i < cities.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 20px",
                  gap: 10,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setExpanded(expanded === city.id ? null : city.id)
                }
              >
                <div style={{ color: "var(--ink-45)", display: "flex" }}>
                  {expanded === city.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {city.name.ar}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-45)" }}>
                    {city.name.en}
                  </div>
                </div>
                <span className="chip ok" style={{ fontSize: 11 }}>
                  {city.areas_count} منطقة
                </span>
                <button
                  className="btn btn-q"
                  style={{ padding: "6px 10px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openAreaCreate(city.id);
                  }}
                  title="إضافة منطقة"
                >
                  <Plus size={13} />
                </button>
                <button
                  className="btn btn-q"
                  style={{ padding: "6px 10px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openCityEdit(city);
                  }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  className="btn"
                  style={{
                    padding: "6px 10px",
                    color: "var(--danger)",
                    background: "rgba(179,64,47,.07)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCityDelete(city.id);
                  }}
                  disabled={deleting === "city-" + city.id}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {expanded === city.id && (
                <div
                  style={{
                    background: "var(--paper)",
                    borderTop: "1px solid var(--line)",
                    padding: "8px 20px 12px",
                  }}
                >
                  {(!city.areas || city.areas.length === 0) && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--ink-45)",
                        padding: "8px 0",
                      }}
                    >
                      لا توجد مناطق
                    </div>
                  )}
                  {city.areas &&
                    city.areas.map((area) => (
                      <div
                        key={area.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "7px 0",
                          borderBottom: "1px dashed var(--line)",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--brand)",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ flex: 1, fontSize: 13 }}>
                          {area.name.ar}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--ink-45)" }}>
                          {area.name.en}
                        </span>
                        <button
                          className="btn btn-q"
                          style={{ padding: "4px 8px" }}
                          onClick={() => openAreaEdit(area, city.id)}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className="btn"
                          style={{
                            padding: "4px 8px",
                            color: "var(--danger)",
                            background: "rgba(179,64,47,.07)",
                            border: "none",
                            borderRadius: "var(--radius-md)",
                            cursor: "pointer",
                          }}
                          onClick={() => handleAreaDelete(area.id)}
                          disabled={deleting === "area-" + area.id}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
      </div>

      <Modal
        open={cityModal !== null}
        onClose={() => setCityModal(null)}
        title={cityModal === "create" ? "مدينة جديدة" : "تعديل المدينة"}
      >
        <div className="field">
          <label className="field-label">الاسم بالعربي</label>
          <input
            className="inp"
            value={cityForm.ar}
            onChange={(e) => setCityForm((p) => ({ ...p, ar: e.target.value }))}
            placeholder="مثال: القاهرة"
          />
        </div>
        <div className="field">
          <label className="field-label">الاسم بالإنجليزي</label>
          <input
            className="inp"
            dir="ltr"
            value={cityForm.en}
            onChange={(e) => setCityForm((p) => ({ ...p, en: e.target.value }))}
            placeholder="e.g. Cairo"
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 6,
          }}
        >
          <button className="btn btn-q" onClick={() => setCityModal(null)}>
            إلغاء
          </button>
          <button
            className="btn btn-p"
            onClick={handleCitySave}
            disabled={saving}
          >
            {cityModal === "create" ? "إضافة" : "حفظ"}
          </button>
        </div>
      </Modal>

      <Modal
        open={areaModal !== null}
        onClose={() => setAreaModal(null)}
        title={areaModal === "create" ? "منطقة جديدة" : "تعديل المنطقة"}
      >
        <div className="field">
          <label className="field-label">الاسم بالعربي</label>
          <input
            className="inp"
            value={areaForm.ar}
            onChange={(e) => setAreaForm((p) => ({ ...p, ar: e.target.value }))}
            placeholder="مثال: المعادي"
          />
        </div>
        <div className="field">
          <label className="field-label">الاسم بالإنجليزي</label>
          <input
            className="inp"
            dir="ltr"
            value={areaForm.en}
            onChange={(e) => setAreaForm((p) => ({ ...p, en: e.target.value }))}
            placeholder="e.g. Maadi"
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 6,
          }}
        >
          <button className="btn btn-q" onClick={() => setAreaModal(null)}>
            إلغاء
          </button>
          <button
            className="btn btn-p"
            onClick={handleAreaSave}
            disabled={saving}
          >
            {areaModal === "create" ? "إضافة" : "حفظ"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
