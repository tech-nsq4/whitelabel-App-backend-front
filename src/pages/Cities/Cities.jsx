import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "../../components/ui/Toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCities,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
  CITIES_KEY,
} from "../../hooks/queries/useCities";
import {
  createAreaApi,
  updateAreaApi,
  deleteAreaApi,
} from "../../api/areas.api";
import Modal from "../../components/ui/Modal";
import "./styles/Cities.css";

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
        await updateCity.mutateAsync({
          id: cityEditId,
          data: { name: cityForm },
        });
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
        await updateAreaApi(areaEditId, {
          city_id: areaCityId,
          name: areaForm,
        });
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
    <div className="cities-page">
      <div className="page-head">
        <div>
          <h1>المدن</h1>
          <div className="sub">{cities.length} مدينة</div>
        </div>
        <button className="btn btn-p" onClick={openCityCreate}>
          <Plus size={15} /> مدينة جديدة
        </button>
      </div>

      <div className="panel cities-panel">
        {/* Skeleton */}
        {loading &&
          [1, 2, 3].map((n) => (
            <div key={n} className="cities-skeleton-row">
              <div className="cities-skeleton-text" />
              <div className="cities-skeleton-spacer" />
              <div className="cities-skeleton-chip" />
            </div>
          ))}

        {/* Cities list */}
        {!loading &&
          cities.map((city) => (
            <div key={city.id} className="city-row">
              <div
                className="city-row-header"
                onClick={() =>
                  setExpanded(expanded === city.id ? null : city.id)
                }
              >
                <div className="city-row-chevron">
                  {expanded === city.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                <div className="city-row-names">
                  <div className="city-row-name-ar">{city.name.ar}</div>
                  <div className="city-row-name-en">{city.name.en}</div>
                </div>
                <span className="chip ok city-areas-count">
                  {city.areas_count} منطقة
                </span>
                <button
                  className="btn btn-q city-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAreaCreate(city.id);
                  }}
                  title="إضافة منطقة"
                >
                  <Plus size={13} />
                </button>
                <button
                  className="btn btn-q city-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCityEdit(city);
                  }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  className="btn city-delete-btn"
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
                <div className="city-areas-panel">
                  {(!city.areas || city.areas.length === 0) && (
                    <div className="city-areas-empty">لا توجد مناطق</div>
                  )}
                  {city.areas &&
                    city.areas.map((area) => (
                      <div key={area.id} className="area-row">
                        <span className="area-dot" />
                        <span className="area-name-ar">{area.name.ar}</span>
                        <span className="area-name-en">{area.name.en}</span>
                        <button
                          className="btn btn-q area-action-btn"
                          onClick={() => openAreaEdit(area, city.id)}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className="btn area-delete-btn"
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

      {/* City Modal */}
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
        <div className="cities-modal-footer">
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

      {/* Area Modal */}
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
        <div className="cities-modal-footer">
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
