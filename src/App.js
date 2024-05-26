import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  onChangeOption = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectsList)
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))

      this.setState({
        apiStatus: apiConstants.success,
        projectsList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderSuccess = () => {
    const {projectsList} = this.state

    return (
      <ul className="ProjectsUl">
        {projectsList.map(projectDetails => (
          <li key={projectDetails.id} className="ProjectLi">
            <img
              className="ProjectImg"
              src={projectDetails.imageUrl}
              alt={projectDetails.name}
            />
            <p className="ProjectName">{projectDetails.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div className="BgFail">
      <img
        className="FailImg"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="FailHead">Oops! Something Went Wrong </h1>
      <p className="FailPara">
        We cannot seem to find the page you are looking for.
      </p>
      <button onClick={this.onClickRetryBtn} type="button" className="RetryBtn">
        Retry
      </button>
    </div>
  )

  renderAllPages = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccess()
      case apiConstants.loading:
        return this.renderLoading()
      case apiConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  onClickRetryBtn = () => {
    this.getProjectsList()
  }

  render() {
    const {activeOptionId} = this.state

    return (
      <div className="Bg">
        <nav className="BgNavbar">
          <img
            className="LogoImg"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="BgHome">
          <select
            onChange={this.onChangeOption}
            value={activeOptionId}
            className="InputBox"
          >
            {categoriesList.map(optionDetails => (
              <option key={optionDetails.id} value={optionDetails.id}>
                {optionDetails.displayText}
              </option>
            ))}
          </select>
          {this.renderAllPages()}
        </div>
      </div>
    )
  }
}
export default App
