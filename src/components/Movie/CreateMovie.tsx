import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createmovie,
  updateMovie,
  getMovie,
  GetAllTags,
} from "../../api/MovieService";
import { useParams, useNavigate } from "react-router-dom";

const CreateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [form, setForm] = useState<{
    title: string;
    imageData: string;
    tags: string;
    userid: string;
    url: string;
  }>({
    title: "",
    imageData: "",
    tags: "",
    url: "",
    userid: localStorage.getItem("token") || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getMovie(id)
        .then((res) => {
          setForm(res.data);
          setLoading(false);
        })
        .catch((err) => {
          toast.error("Error fetching movie" + err);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    GetAllTags({
      userid: localStorage.getItem("token"),
    }).then((res) => {
      console.log(res);
      setTags(res.data);
    });
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/login");
    }
  }, [navigate]);

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64String = result.split(",")[1];
            setForm({ ...form, imageData: base64String });
            setImageUrl(result);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id) {
        await updateMovie(form);
        toast.success("movie updated successfully");
      } else {
        await createmovie(form);
        toast.success("movie created successfully");
      }
      navigate("/movielist");
    } catch (err) {
      toast.error("Error submitting form");
    } finally {
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Create Movie</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Url</label>
          <input
            type="text"
            name="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagedata</label>

          <div>
            <h3>Paste an image here (Ctrl+V)</h3>
            <div
              onPaste={handlePaste}
              contentEditable
              style={{
                border: "2px dashed #aaa",
                padding: "20px",
                minHeight: "150px",
                cursor: "text",
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Pasted" style={{ maxWidth: "100%" }} />
              ) : (
                "Click here and paste an image from clipboard"
              )}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>

          <input
            type="text"
            name="tags"
            value={form.tags}
            className="form-control"
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            required
          />

          {tags &&
            tags.length > 0 &&
            tags.map((item, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={item}
                  checked={form.tags.includes(item)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({
                        ...form,
                        tags: form.tags ? `${form.tags}, ${item}` : item,
                      });
                    } else {
                      setForm({
                        ...form,
                        tags: form.tags
                          .replace(`, ${item}`, "")
                          .replace(item, ""),
                      });
                    }
                  }}
                />
                {` ${item}`}
              </label>
            ))}
        </div>
        <div className="mb-3" hidden>
          <label htmlFor="userid" className="form-label">
            User ID
          </label>
          <input
            type="text"
            className="form-control"
            id="userid"
            name="userid"
            value={form.userid}
            disabled
          />
        </div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            type="button"
            className="btn btn-secondary flex-fill me-2"
            onClick={() => navigate("/movielist")}
          >
            {" "}
            Cancel{" "}
          </button>
          <button type="submit" className="btn btn-primary flex-fill">
            {" "}
            Save{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMovie;
