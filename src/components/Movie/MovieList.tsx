import { useEffect, useState } from "react";
import { DeleteMovie, GetMovies } from "../../api/MovieService";
import { Link } from "react-router-dom";
import { API_URL, subscription_key } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

interface Movie {
  id: string;
  userId: string;

  title: string;
  imageData: Uint32Array;
  tags: string;
  url: string;
  isJav: boolean;
}

const MovieList = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isJav, setIsJav] = useState<boolean>(false);
  const [showImages, setShowImages] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchtxt, setSearchtxt] = useState("");
  const [pageNumber, setPgNo] = useState(1);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchMovies = async () => {
    setLoading(true);
    const res = await GetMovies({
      pageNumber,
      searchtxt,
      userid: localStorage.getItem("token"),
      tags: selectedTags.join(", "),
      isJav,
    });
    //console.log(res.data.movies);
    setMovies(res.data.movies); // updated to res.data.dates
    setTags(res.data.tags); // updated to res.data.tags
    setPagination(res.data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [pageNumber, searchtxt, selectedTags, isJav]);

  const handlePageChange = (newPageNumber: number) => {
    setPgNo(newPageNumber);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (confirmDelete) {
      setLoading(true);
      await DeleteMovie(id);
      setLoading(false);
      fetchMovies();
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Movie List</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm" // 'form-control-sm' reduces height
            placeholder="Search by title"
            value={searchtxt}
            onChange={(e) => setSearchtxt(e.target.value)}
          />
          <div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="chkIsJav"
                onChange={(e) => setIsJav(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="chkIsJav">
                {" "}
                Is Jav{" "}
              </label>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="chkShowImages"
                onChange={(e) => setShowImages(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="chkShowImages">
                {" "}
                Show Images{" "}
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div>
            {tags &&
              tags.length > 0 &&
              tags.map((item, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={item}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags([...selectedTags, item]);
                      } else {
                        setSelectedTags(
                          selectedTags.filter((tag) => tag !== item)
                        );
                      }
                      setPgNo(1);
                    }}
                  />
                  {` ${item}`}
                </label>
              ))}
          </div>
        </div>
        <div className="col-md-1">
          <Link to="/movielist/create">
            <button className="btn btn-primary w-100">Add</button>
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container mt-4">
          <div className="row">
            {movies.map((item) => (
              <>
                {/* {console.log(item.id)} */}
                <div key={item.id} className="col-md-2 mb-4">
                  <div className="card h-100">
                    {showImages ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={
                            API_URL.includes("myreactappbackendapi")
                              ? `${API_URL}/image/${item.id}?subscription-key=${subscription_key}`
                              : `${API_URL}/image/${item.id}`
                          }
                          className="card-img-top"
                          alt={item.title}
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                      </a>
                    ) : (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                    )}

                    <div
                      style={{ fontSize: "1rem" }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <h5 className="mb-0" style={{ fontSize: "0.75rem" }}>
                        {item.title}
                      </h5>
                      <div>
                        <Link
                          to={`/movielist/edit/${item.id}`}
                          className="me-2 text-secondary"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      )}
      {pagination.totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pageNumber - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(pagination.totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  pageNumber === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                pageNumber === pagination.totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(pageNumber + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MovieList;
